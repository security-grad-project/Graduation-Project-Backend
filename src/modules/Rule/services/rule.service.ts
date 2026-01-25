import logger from '../../../common/utils/logger';
import { prisma } from '../../../config/postgres';
import { createRuleData, GetRuleQueryOption, updateRuleData } from '../types/types';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';

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

  logger.info(`rule got successfully: id ${id}`);
  return rule;
};
