import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { paginate } from '../../../common/utils/ApiFeatures.utils';
import logger from '../../../common/utils/logger';
import { prisma } from '../../../config/postgres';
import { createDashboardData, ListDashboardsQuery, updateDashboardData } from '../types/types';
import { buildDashboardFilter } from './dashboard.utils';

export const createDashboardService = async (ownerId: string, data: createDashboardData) => {
  const dashboard = await prisma.dashboard.create({
    data: {
      title: data.title,
      description: data.description,
      tags: data.tags ?? [],
      panels: data.panels ?? [],
      ownerId,
    },
  });
  logger.info(`dashboard created successfully: title ${dashboard.title}`);
  return dashboard;
};

export const updateDashboardService = async (id: string, data: updateDashboardData) => {
  const dashboard = await prisma.dashboard.update({
    where: { id },
    data: { ...data },
  });

  logger.info(`dashboard updated successfully: id ${id}`);
  return dashboard;
};

export const deleteDashboardService = async (id: string) => {
  await prisma.dashboard.delete({ where: { id } });
  logger.info(`dashboard deleted successfully: id ${id}`);
};

export const getDashboardService = async (id: string) => {
  const dashboard = await prisma.dashboard.findUnique({ where: { id } });
  if (!dashboard) throw new ApiErrorHandler(404, 'Dashboard Not Found');

  logger.info(`dashboard retrieved successfully: id ${id}`);
  return dashboard;
};

export const getAllDashboardsService = async (query: ListDashboardsQuery) => {
  const where = buildDashboardFilter({ search: query.search });

  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.dashboard.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.dashboard.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};
