import logger from '../../../common/utils/logger';
import { prisma } from '../../../config/postgres';
import { createRuleData, updateRuleData } from '../types/types';

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
