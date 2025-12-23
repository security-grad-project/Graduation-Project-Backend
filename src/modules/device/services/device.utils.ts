import { Prisma } from '@prisma/client';

export const buildDeviceFilter = (query: {
  userId?: string;
  ip?: string;
  hostName?: string;
  port?: string;
  createdAt?: string;
}): Prisma.DeviceWhereInput => {
  const { userId, ip, hostName, port, createdAt } = query;
  const where: Prisma.DeviceWhereInput = {};

  if (userId) where.userId = userId;
  if (ip) where.ip = ip;
  if (hostName) where.hostName = { contains: hostName, mode: 'insensitive' };

  if (port) {
    if (port.includes('-')) {
      const [min, max] = port.split('-').map(Number);
      where.port = { gte: min, lte: max };
    } else {
      where.port = Number(port);
    }
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
