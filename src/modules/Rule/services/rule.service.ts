import logger from '../../../common/utils/logger';
import { prisma } from '../../../config/postgres';
import { createRuleData } from '../types/types';

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
