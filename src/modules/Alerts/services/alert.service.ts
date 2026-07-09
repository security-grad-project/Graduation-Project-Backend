import logger from '../../../common/utils/logger';
import { prisma } from '../../../config/postgres';
import { Prisma } from '@prisma/client';
import { AlertStatsQuery, ListAlertsQuery, updateAlertStatusData } from '../types/types';
import { buildAlertFilter } from './alert.utils';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';

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

export const getAlertService = async (id: string) => {
  const alert = await prisma.alert.findUnique({
    where: { id },
    include: { device: true, rule: true },
  });

  if (!alert) {
    throw new ApiErrorHandler(404, 'Alert not found');
  }

  logger.info(`Alert retrieved successfully: id ${id}`);
  return alert;
};

export const updateAlertStatusService = async (id: string, data: updateAlertStatusData) => {
  const alert = await prisma.alert.update({
    where: { id },
    data,
    include: { device: true, rule: true },
  });

  logger.info(`alert status updated: id ${id} -> ${data.status}`);
  return alert;
};

export const getAlertStatsService = async (query: AlertStatsQuery) => {
  const where = buildAlertFilter({
    severity: query.severity,
    status: query.status,
    search: query.search,
  });

  const [total, bySeverity] = await Promise.all([
    prisma.alert.count({ where }),
    prisma.alert.groupBy({ by: ['severity'], where, _count: { _all: true } }),
  ]);

  const severityCounts: Record<string, number> = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
  for (const row of bySeverity) severityCounts[row.severity] = row._count._all;

  return { total, bySeverity: severityCounts };
};
