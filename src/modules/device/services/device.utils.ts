import { Prisma } from '@prisma/client';

export const buildDeviceFilter = (query: {
  ip?: string;
  hostName?: string;
  createdAt?: string;
}): Prisma.DeviceWhereInput => {
  const { ip, hostName, createdAt } = query;
  const where: Prisma.DeviceWhereInput = {};
  if (ip) where.ip = ip;
  if (hostName) where.hostName = { contains: hostName, mode: 'insensitive' };

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
