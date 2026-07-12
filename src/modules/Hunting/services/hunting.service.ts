import { prisma } from '../../../config/postgres';
import { runElasticsearchQuery } from '../../../common/utils/queryRunner';
import { QueryResult, RunQueryDto } from '../types/types';

export const runHuntingQueryService = async (dto: RunQueryDto): Promise<QueryResult> => {
  const { query, language } = dto;

  const logSources = await prisma.logSource.findMany({
    where: { enabled: true },
    select: { index: true },
  });
  const activeIndices = logSources.map((ls) => ls.index);

  if (activeIndices.length === 0) {
    return { mode: 'events', columns: [], rows: [], total: 0, took: 0 };
  }

  return await runElasticsearchQuery(query, language, activeIndices);
};
