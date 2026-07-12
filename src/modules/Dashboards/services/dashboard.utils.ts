import { Prisma } from '@prisma/client';

export const buildDashboardFilter = (query: {
  search?: string;
  ownerId?: string;
  createdAt?: string;
}): Prisma.DashboardWhereInput => {
  const { search, ownerId, createdAt } = query;
  const where: Prisma.DashboardWhereInput = {};

  if (ownerId) where.ownerId = ownerId;

  if (search) {
    where.OR = [
      {
        title: {
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
