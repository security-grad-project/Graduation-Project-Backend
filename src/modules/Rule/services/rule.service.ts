import logger from '../../../common/utils/logger';
import { prisma } from '../../../config/postgres';
import {
  countRulesQuery,
  createRuleData,
  GetRuleQueryOption,
  ListRulesQuery,
  RulesByType,
  updateRuleData,
} from '../types/types';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { buildRuleFilter } from './rule.utils';
import { paginate } from '../../../common/utils/primsa-util';

export const createRuleService = async (data: createRuleData) => {
  const rule = await prisma.rule.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
    },
    include: {
      _count: {
        select: { alerts: true },
      },
    },
  });

  logger.info(`rule created successfully: name ${rule.name}`);
  return rule;
};

export const updateRuleService = async (id: string, data: updateRuleData) => {
  const rule = await prisma.rule.update({
    where: { id: id },
    data,
    include: {
      _count: {
        select: { alerts: true },
      },
    },
  });

  logger.info(`rule updated successfully: id ${id}`);
  return rule;
};

export const deleteRuleService = async (id: string) => {
  return await prisma.rule.delete({
    where: { id: id },
  });
};

export const getRuleService = async (id: string, option: GetRuleQueryOption = {}) => {
  const { includeAlerts } = option;
  const rule = await prisma.rule.findUnique({
    where: { id: id },
    include: {
      _count: {
        select: { alerts: true },
      },
      alerts: includeAlerts,
    },
  });
  if (!rule) throw new ApiErrorHandler(404, 'Rule Not Found');

  logger.info(`rule retrieved successfully: id ${id}`);
  return rule;
};

export const getAllRulesService = async (query: ListRulesQuery) => {
  const where = buildRuleFilter({
    type: query.type,
    search: query.search,
  });

  const inclusions: any = {};
  if (query.includeCount) inclusions._count = { select: { alerts: true } };
  if (query.includeAlerts) inclusions.alerts = true;

  return await paginate(
    prisma.rule,
    {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    },
    where,
    Object.keys(inclusions).length > 0 ? inclusions : undefined,
  );
};

export const getRulesByTypesService = async (type: string, query: RulesByType) => {
  const where = { type };
  return await paginate(
    prisma.rule,
    {
      page: query.page,
      limit: query.limit,
    },
    where,
  );
};

export const getRuleWithAlertsService = async (id: string) => {
  const rule = await prisma.rule.findUnique({
    where: { id: id },
    include: {
      _count: {
        select: { alerts: true },
      },
      alerts: true,
    },
  });
  if (!rule) throw new ApiErrorHandler(404, 'Rule Not Found');

  logger.info(`rule retrieved successfully: id ${id}`);
  return rule;
};

export const updateFullRuleService = async (id: string, data: createRuleData) => {
  const rule = await prisma.rule.update({
    where: { id: id },
    data,
    include: {
      _count: {
        select: { alerts: true },
      },
    },
  });

  logger.info(`rule updated successfully: id ${id}`);
  return rule;
};

export const countRulesService = async (query: countRulesQuery) => {
  const where = buildRuleFilter({
    type: query.type,
    search: query.search,
  });

  return await prisma.rule.count({ where });
};

export const duplicateRuleService = async (id: string, name: string) => {
  const rule = await prisma.rule.findUnique({
    where: { id: id },
  });

  if (!rule) throw new ApiErrorHandler(404, 'Rule Not Found');

  const duplicateRule = await prisma.rule.create({
    data: {
      name,
      description: rule.description,
      type: rule.type,
    },
    include: {
      _count: {
        select: { alerts: true },
      },
    },
  });
  return duplicateRule;
};

export const bulkCreateRulesService = async (rules: createRuleData[]) => {
  return await prisma.rule.createMany({
    data: rules,
    skipDuplicates: true,
  });
};

export const bulkDeleteRulesService = async (ids: string[]) => {
  return await prisma.rule.deleteMany({
    where: { id: { in: ids } },
  });
};
