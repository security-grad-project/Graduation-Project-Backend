import logger from '../../../common/utils/logger';
import { prisma } from '../../../config/postgres';
import { createDashboardData } from '../types/types';

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
