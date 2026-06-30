import { Prisma } from '@prisma/client';
import { ListServicesQueryDto } from '../dto/list-service-query.dto';

const isValidDate = (d: any) => d instanceof Date && !isNaN(d.getTime());

export const buildServiceFilter = (query: ListServicesQueryDto): Prisma.ServiceWhereInput => {
  const where: Prisma.ServiceWhereInput = {};

  if (query.type) where.type = { contains: query.type, mode: 'insensitive' };

  if (query.userId) where.userId = query.userId;

  if (query.deviceId) where.deviceId = query.deviceId;

  if (query.port !== undefined && query.port !== null && query.port !== '') {
    const portStr = String(query.port);
    if (portStr.includes('-')) {
      const [min, max] = portStr.split('-').map(Number);
      where.port = { gte: min, lte: max };
    } else {
      where.port = Number(portStr);
    }
  }

  if (query.startDate || query.endDate) {
    where.createdAt = {};
    if (query.startDate) where.createdAt.gte = query.startDate;
    if (query.endDate) where.createdAt.lte = query.endDate;
  } else if (query.createdAt) {
    if (query.createdAt.includes('to')) {
      const [start, end] = query.createdAt.split('to').map((d) => new Date(d.trim()));
      if (isValidDate(start) && isValidDate(end)) {
        where.createdAt = { gte: start, lte: end };
      }
    } else {
      const date = new Date(query.createdAt);
      if (isValidDate(date)) {
        where.createdAt = { gte: date };
      }
    }
  }
  return where;
};
