import { Prisma } from '@prisma/client';
import { listDevicesQueryInput } from '../validation/device.validation';

export const buildDeviceFilter = (query: listDevicesQueryInput): Prisma.DeviceWhereInput => {
  const { userId, ip, hostName } = query;
  const where: Prisma.DeviceWhereInput = {};
  if (userId) where.userId = userId;
  if (ip) where.ip = ip;
  if (hostName) where.hostName = { contains: hostName, mode: 'insensitive' };

  return where;
};
