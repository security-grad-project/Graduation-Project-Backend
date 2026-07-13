import { elasticClient } from '../../config/elasticsearch';
import ApiErrorHandler from './ApiErrorHandler';
import { QueryResult } from '../interfaces/query.types';

export const translateKqlToDsl = (kql: string) => {
  const queryText = kql.trim();
  if (!queryText || queryText === '' || queryText === '*') {
    return { match_all: {} };
  }

  const lucene = queryText
    .replace(/\band\b/gi, 'AND')
    .replace(/\bor\b/gi, 'OR')
    .replace(/\bnot\b/gi, 'NOT')
    .replace(/([\w\.\-_]+)\s*:\s*\*/g, '_exists_:$1');

  return {
    query_string: {
      query: lucene,
      analyze_wildcard: true,
      default_operator: 'AND' as const,
    },
  };
};

export const matchIndexPattern = (target: string, allowedPatterns: string[]): boolean => {
  const cleanTarget = target.toLowerCase();

  const patternToRegex = (pat: string) => {
    const escaped = pat.replace(/[-\/\\^$+?.()|[\]{}*]/g, '\\$&');
    const regexStr = '^' + escaped.replace(/\\\*/g, '.*') + '$';
    return new RegExp(regexStr, 'i');
  };

  return allowedPatterns.some((pattern) => {
    const patternRegex = patternToRegex(pattern);
    const targetRegex = patternToRegex(target);

    return (
      patternRegex.test(cleanTarget) ||
      targetRegex.test(pattern.toLowerCase()) ||
      pattern.toLowerCase() === cleanTarget ||
      cleanTarget === '*' ||
      cleanTarget === 'logs-*' ||
      cleanTarget === 'logs-*-*'
    );
  });
};

const translateEsError = (err: any): ApiErrorHandler => {
  if (err?.name === 'ResponseError') {
    const reason: string | undefined = err.body?.error?.reason || err.message;
    const esStatus: number = err.body?.status || err.statusCode || 400;
    const statusCode = esStatus === 404 ? 400 : esStatus >= 400 && esStatus < 500 ? esStatus : 502;
    return new ApiErrorHandler(statusCode, `Elasticsearch query failed: ${reason}`);
  }
  if (err?.name === 'ConnectionError' || err?.name === 'TimeoutError') {
    return new ApiErrorHandler(502, 'Could not reach Elasticsearch. Please try again shortly.');
  }
  return new ApiErrorHandler(500, 'Query execution failed');
};

export const runElasticsearchQuery = async (
  query: string,
  language: 'esql' | 'kql',
  activeIndices: string[],
): Promise<QueryResult> => {
  const startTime = Date.now();

  if (language === 'kql') {
    const dslQuery = translateKqlToDsl(query);
    let response;
    try {
      response = await elasticClient.search({
        index: activeIndices.join(','),
        query: dslQuery,
        size: 1000,
        timeout: '30s',
      });
    } catch (err: any) {
      throw translateEsError(err);
    }

    const hits = response.hits.hits;

    const rows = hits.map((hit: any) => ({
      id: hit._id,
      _index: hit._index,
      ...hit._source,
      '@timestamp': hit._source?.['@timestamp'] || hit._source?.timestamp || null,
      Document: hit._source,
    }));

    return {
      mode: 'events',
      columns: ['@timestamp', 'Document'],
      rows,
      total: response.hits.total
        ? typeof response.hits.total === 'object'
          ? response.hits.total.value
          : response.hits.total
        : 0,
      took: response.took ?? Date.now() - startTime,
    };
  } else {
    const fromMatch = query.match(/^\s*from\s+([^\s|]+)/i);
    if (!fromMatch) {
      throw new ApiErrorHandler(400, 'ES|QL queries must start with FROM <index_pattern>');
    }
    const targetIndex = fromMatch[1].replace(/['"]/g, '').trim();

    const matchedIndices = activeIndices.filter((idx) => matchIndexPattern(idx, [targetIndex]));
    if (matchedIndices.length === 0) {
      throw new ApiErrorHandler(403, `Access denied for index pattern: ${targetIndex}`);
    }

    let rewrittenQuery = query
      .trim()
      .replace(/^\s*from\s+[^\s|]+/i, `FROM ${matchedIndices.join(',')}`);
    const limitRegex = /\|\s*limit\s+(\d+)/i;
    const limitMatch = rewrittenQuery.match(limitRegex);
    if (!limitMatch) {
      rewrittenQuery += ' | LIMIT 1000';
    } else {
      const currentLimit = parseInt(limitMatch[1], 10);
      if (currentLimit > 1000) {
        rewrittenQuery = rewrittenQuery.replace(limitRegex, '| LIMIT 1000');
      }
    }
    let esqlRes;
    try {
      esqlRes = await elasticClient.esql.query(
        { query: rewrittenQuery },
        { requestTimeout: 30000 },
      );
    } catch (err: any) {
      throw translateEsError(err);
    }
    const columns = esqlRes.columns.map((c: any) => c.name);
    const rows = esqlRes.values.map((row: any[]) => {
      const obj: any = {};
      columns.forEach((colName, idx) => {
        obj[colName] = row[idx];
      });
      return obj;
    });
    const mode = /\|\s*stats\s+/i.test(rewrittenQuery) ? 'stats' : 'events';
    return {
      mode,
      columns,
      rows,
      total: rows.length,
      took: esqlRes.took ?? Date.now() - startTime,
    };
  }
};
