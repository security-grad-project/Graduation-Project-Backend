import { elasticClient } from '../../../config/elasticsearch';
import logger from '../../../common/utils/logger';
import { prisma } from '../../../config/postgres';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';

import {
  FieldInfo,
  ESField,
  ESIndexMapping,
  DiscoverFieldsResponse,
  FieldStatsResponse,
} from '../types/discover.DTOs';

const META_FIELDS = [
  '_id',
  '_index',
  '_score',
  '_source',
  '_type',
  '_version',
  '_seq_no',
  '_primary_term',
  '_routing',
];

export class DiscoverService {
  public async getFields(): Promise<DiscoverFieldsResponse> {
    try {
      const logSources = await prisma.logSource.findMany({
        where: { enabled: true },
        select: { index: true },
      });
      const activeIndices = logSources.map((ls) => ls.index);

      if (activeIndices.length === 0) {
        return {
          popular: [],
          available: [],
          empty: [],
          meta: META_FIELDS.map((field) => ({ name: field, type: field })),
        };
      }

      const indicesString = activeIndices.join(',');

      const response = await elasticClient.indices.getMapping({
        index: indicesString,
        ignore_unavailable: true,
        allow_no_indices: true,
      });

      const mappings = ('body' in response
        ? (response as unknown as { body: Record<string, ESIndexMapping> }).body
        : response) as unknown as Record<string, ESIndexMapping>;

      const fieldsMap = new Map<string, string>();

      for (const indexName in mappings) {
        if (Object.prototype.hasOwnProperty.call(mappings, indexName)) {
          const indexMapping = mappings[indexName].mappings;

          if (indexMapping?.properties) {
            this.extractFields(indexMapping.properties, '', fieldsMap);
          }
        }
      }

      const allFields: FieldInfo[] = [];

      fieldsMap.forEach((type, name) => {
        allFields.push({
          name,
          type,
        });
      });

      const usageMap = new Map<string, number>();

      try {
        const searchResponse = await elasticClient.search({
          index: indicesString,
          size: 0,
          aggs: {
            fields: {
              terms: {
                field: '_field_names',
                size: 1000,
              },
            },
          },
          ignore_unavailable: true,
          allow_no_indices: true,
        });

        const searchBody = (
          'body' in searchResponse ? (searchResponse as any).body : searchResponse
        ) as any;

        const buckets = searchBody.aggregations?.fields?.buckets || [];

        buckets.forEach((bucket: any) => {
          usageMap.set(bucket.key, bucket.doc_count);
        });
      } catch (error) {
        logger.warn('Failed to calculate field usage', error);
      }

      const available: FieldInfo[] = allFields.map((field) => ({
        ...field,
        ...(usageMap.has(field.name) ? { count: usageMap.get(field.name) } : {}),
      }));

      const empty: FieldInfo[] = allFields.filter((field) => !usageMap.has(field.name));

      const popular = available
        .filter((field) => field.count)
        .sort((a, b) => (b.count || 0) - (a.count || 0))
        .slice(0, 5);

      available.sort((a, b) => a.name.localeCompare(b.name));

      empty.sort((a, b) => a.name.localeCompare(b.name));

      return {
        popular,
        available,
        empty,
        meta: META_FIELDS.map((field) => ({ name: field, type: field })),
      };
    } catch (error) {
      logger.error('Error fetching fields from Elasticsearch:', error);

      return {
        popular: [],
        available: [],
        empty: [],
        meta: META_FIELDS.map((field) => ({ name: field, type: field })),
      };
    }
  }

  public async getFieldStats(field: string): Promise<FieldStatsResponse | null> {
    try {
      const logSources = await prisma.logSource.findMany({
        where: { enabled: true },
        select: { index: true },
      });
      const activeIndices = logSources.map((ls) => ls.index);

      if (activeIndices.length === 0) {
        return {
          field,
          type: 'unknown',
          documents: 0,
        };
      }

      const indicesString = activeIndices.join(',');

      const mappingResponse = await elasticClient.indices.getMapping({
        index: indicesString,
        ignore_unavailable: true,
        allow_no_indices: true,
      });

      const mappings = ('body' in mappingResponse
        ? (mappingResponse as unknown as { body: Record<string, ESIndexMapping> }).body
        : mappingResponse) as unknown as Record<string, ESIndexMapping>;

      const fieldsMap = new Map<string, string>();
      for (const indexName in mappings) {
        if (Object.prototype.hasOwnProperty.call(mappings, indexName)) {
          const indexMapping = mappings[indexName].mappings;
          if (indexMapping?.properties) {
            this.extractFields(indexMapping.properties, '', fieldsMap);
          }
        }
      }

      let fieldType = fieldsMap.get(field);
      let searchField = field;

      if (fieldType === 'text' && fieldsMap.has(`${field}.keyword`)) {
        fieldType = fieldsMap.get(`${field}.keyword`);
        searchField = `${field}.keyword`;
      } else if (!fieldType && fieldsMap.has(`${field}.keyword`)) {
        fieldType = fieldsMap.get(`${field}.keyword`);
        searchField = `${field}.keyword`;
      }

      if (!fieldType && META_FIELDS.includes(field)) {
        fieldType = 'keyword';
      }

      if (!fieldType) {
        throw new ApiErrorHandler(404, `Field "${field}" not found in active indices`);
      }

      const totalDocsResponse = await elasticClient.count({
        index: indicesString,
        ignore_unavailable: true,
        allow_no_indices: true,
      });

      const totalDocuments = (
        'body' in totalDocsResponse
          ? (totalDocsResponse as any).body.count
          : totalDocsResponse.count
      ) as number;

      if (totalDocuments === 0) {
        return { field, type: fieldType, documents: 0 };
      }

      const isNumeric = [
        'long',
        'integer',
        'short',
        'byte',
        'double',
        'float',
        'half_float',
        'scaled_float',
      ].includes(fieldType);
      const isDate = fieldType === 'date' || fieldType === 'date_nanos';

      let aggregation: any = {};

      if (isNumeric || isDate) {
        aggregation = {
          field_stats: {
            stats: { field: searchField },
          },
        };
      } else {
        aggregation = {
          field_terms: {
            terms: { field: searchField, size: 10 },
          },
        };
      }

      const searchResponse = await elasticClient.search({
        index: indicesString,
        size: 0,
        aggs: aggregation,
        ignore_unavailable: true,
        allow_no_indices: true,
      });

      const searchBody = (
        'body' in searchResponse ? (searchResponse as any).body : searchResponse
      ) as any;
      const aggs = searchBody.aggregations;

      const response: FieldStatsResponse = {
        field,
        type: fieldType,
        documents: totalDocuments,
      };

      if (aggs?.field_terms) {
        const buckets = aggs.field_terms.buckets || [];
        response.values = buckets.map((b: any) => {
          const docCount = b.doc_count;
          const percentage = totalDocuments > 0 ? (docCount / totalDocuments) * 100 : 0;
          return {
            value: b.key,
            count: docCount,
            percentage: parseFloat(percentage.toFixed(2)),
          };
        });
      } else if (aggs?.field_stats) {
        response.stats = {
          count: aggs.field_stats.count,
          min: aggs.field_stats.min_as_string ?? aggs.field_stats.min,
          max: aggs.field_stats.max_as_string ?? aggs.field_stats.max,
          avg: aggs.field_stats.avg,
          sum: aggs.field_stats.sum,
        };
      }

      return response;
    } catch (error: any) {
      if (error instanceof ApiErrorHandler) throw error;
      logger.error(`Error fetching stats for field ${field}:`, error);
      throw new ApiErrorHandler(500, 'Error fetching field statistics');
    }
  }

  private extractFields(
    properties: Record<string, ESField>,
    prefix: string,
    fieldsMap: Map<string, string>,
  ): void {
    for (const key in properties) {
      if (!Object.prototype.hasOwnProperty.call(properties, key)) {
        continue;
      }

      const field = properties[key];

      const fieldName = prefix ? `${prefix}.${key}` : key;

      if (field.properties) {
        this.extractFields(field.properties, fieldName, fieldsMap);
      } else if (field.type) {
        fieldsMap.set(fieldName, field.type);
      } else if (field.fields) {
        const subFields = Object.keys(field.fields);

        if (subFields.length > 0) {
          fieldsMap.set(fieldName, field.fields[subFields[0]].type || 'string');
        }
      }
    }
  }
}

export const discoverService = new DiscoverService();
