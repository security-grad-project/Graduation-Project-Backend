import logger from '../../../common/utils/logger';
import { prisma } from '../../../config/postgres';
import { createDashboardData, updateDashboardData } from '../types/types';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';

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
  const existing = await prisma.dashboard.findUnique({ where: { id } });
  if (!existing) throw new ApiErrorHandler(404, 'Dashboard Not Found');

  const dashboard = await prisma.dashboard.update({
    where: { id },
    data: { ...data },
  });

  logger.info(`dashboard updated successfully: id ${id}`);
  return dashboard;
};
