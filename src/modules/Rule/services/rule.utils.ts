import { Prisma } from '@prisma/client';

export const buildRuleFilter = (query: {
  type?: string;
  search?: string;
  createdAt?: string;
}): Prisma.RuleWhereInput => {
  const { type, search, createdAt } = query;
  const where: Prisma.RuleWhereInput = {};

  if (type) where.type = type;
  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
  }
  if (createdAt) {
    if (createdAt.includes('to')) {
      const [start, end] = createdAt.split('to').map((d) => new Date(d.trim()));
      where.createdAt = { gte: start, lte: end };
    } else {
      where.createdAt = { gte: new Date(createdAt) };
    }
  }

  return where;
};
