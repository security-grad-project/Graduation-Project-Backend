import logger from '../../../common/utils/logger';
import { prisma } from '../../../config/postgres';
import { runElasticsearchQuery } from '../../../common/utils/queryRunner';
import { QueryResult, RunQueryDto, createSavedQueryData, updateSavedQueryData, ListSavedQueriesQuery } from '../types/types';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { paginate } from '../../../common/utils/primsa-util';

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

  const result = await runElasticsearchQuery(query, language, activeIndices);
  logger.info('Hunting query executed successfully');
  return result;
};

export const getSavedQueriesService = async (query: ListSavedQueriesQuery) => {
  const where: any = {};
  
  if (query.category) {
    where.category = query.category;
  }
  
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { category: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  return await paginate(
    prisma.huntingQuery,
    {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    },
    where
  );
};

export const createSavedQueryService = async (data: createSavedQueryData) => {
  const existing = await prisma.huntingQuery.findUnique({
    where: { name: data.name },
  });
  if (existing) {
    throw new ApiErrorHandler(400, `A saved query with name "${data.name}" already exists`);
  }

  const query = await prisma.huntingQuery.create({
    data,
  });

  logger.info(`Saved query created successfully: name ${query.name}`);
  return query;
};

export const updateSavedQueryService = async (id: string, data: updateSavedQueryData) => {
  const query = await prisma.huntingQuery.findUnique({
    where: { id },
  });
  if (!query) {
    throw new ApiErrorHandler(404, 'Saved query not found');
  }

  if (data.name) {
    const existing = await prisma.huntingQuery.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });
    if (existing) {
      throw new ApiErrorHandler(400, `A saved query with name "${data.name}" already exists`);
    }
  }

  const updatedQuery = await prisma.huntingQuery.update({
    where: { id },
    data,
  });

  logger.info(`Saved query updated successfully: id ${id}`);
  return updatedQuery;
};

export const deleteSavedQueryService = async (id: string) => {
  const query = await prisma.huntingQuery.findUnique({
    where: { id },
  });
  if (!query) {
    throw new ApiErrorHandler(404, 'Saved query not found');
  }

  await prisma.huntingQuery.delete({
    where: { id },
  });

  logger.info(`Saved query deleted successfully: id ${id}`);
};
