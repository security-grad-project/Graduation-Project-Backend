import logger from '../../../common/utils/logger';
import { prisma } from '../../../config/postgres';
import { Prisma } from '@prisma/client';
import { ListAlertsQuery } from '../types/types';
import { buildAlertFilter } from './alert.utils';

const DEFAULT_ALERT_ORDER_BY: Prisma.AlertOrderByWithRelationInput[] = [
  { severity: 'desc' },
  { createdAt: 'desc' },
];
export const getAllAlertsService = async (query: ListAlertsQuery) => {
  const where = buildAlertFilter({
    severity: query.severity,
    status: query.status,
    search: query.search,
    deviceId: query.deviceId,
  });

  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const orderBy = query.sortBy
    ? { [query.sortBy]: query.sortOrder || 'desc' }
    : DEFAULT_ALERT_ORDER_BY;

  const [data, total] = await Promise.all([
    prisma.alert.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { device: true, rule: true },
    }),
    prisma.alert.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  logger.info(`alerts retrieved successfully: total ${total}`);

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
