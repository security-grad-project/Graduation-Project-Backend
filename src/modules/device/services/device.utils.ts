import { Prisma } from '@prisma/client';

export const buildDeviceFilter = (query: {
  userId?: string;
  ip?: string;
  hostName?: string;
  port?: string; // Can be "80" or "80-443" for range
  createdAt?: string; // Can be "2024-01-01" or "2024-01-01 to 2024-12-31"
}): Prisma.DeviceWhereInput => {
  const { userId, ip, hostName, port, createdAt } = query;
  const where: Prisma.DeviceWhereInput = {};

  if (userId) where.userId = userId;
  if (ip) where.ip = ip;
  if (hostName) where.hostName = { contains: hostName, mode: 'insensitive' };

  // Port range example: "80-443" or single value "80"
  if (port) {
    if (port.includes('-')) {
      const [min, max] = port.split('-').map(Number);
      where.port = { gte: min, lte: max };
    } else {
      where.port = Number(port);
    }
  }

  // Date range example
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
