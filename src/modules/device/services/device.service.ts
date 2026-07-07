import { CreateDeviceDto, UpdateDeviceDto, ListDevicesQueryDto } from '../dto';
import { prisma } from '../../../config/postgres';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { STATUS_CODE } from '../../../common/constants/constants';
import { DeviceQueryOptions as GetDeviceQueryOptions } from '../types/device.types';
import logger from '../../../common/utils/logger';
import { buildDeviceFilter } from './device.utils';
import { createPrismaStream, paginate } from '../../../common/utils/primsa-util';
import { Prisma } from '@prisma/client';

export const createDeviceService = async (data: CreateDeviceDto) => {
  const device = await prisma.device.create({
    data: {
      ip: data.ip,
      hostName: data.hostName,
    },
  });

  logger.info(`Device created successfully: ID ${device.id}`);
  return device;
};

export const getDeviceByIdService = async (id: string, options: GetDeviceQueryOptions = {}) => {
  const { includeServices, includeAlerts } = options;
  const device = await prisma.device.findUnique({
    where: { id: id },
    include: {
      services: includeServices,
      alerts: includeAlerts,
    },
  });
  if (!device) {
    throw new ApiErrorHandler(STATUS_CODE.NOT_FOUND, 'Device not found');
  }
  return device;
};

export const updateDeviceService = async (id: string, data: UpdateDeviceDto) => {
  const device = await prisma.device.update({
    where: {
      id: id,
    },
    data,
  });
  logger.info(`Device updated successfully: ID ${id}`);
  return device;
};

export const deleteDeviceService = async (id: string) => {
  await prisma.device.delete({ where: { id: id } });
  logger.info(`Device deleted successfully: ID ${id}`);
};

export const listDevicesService = async (query: ListDevicesQueryDto) => {
  const where = buildDeviceFilter({
    ip: query.ip,
    hostName: query.hostName,
    createdAt: query.createdAt,
  } as any);

  const include: Prisma.DeviceInclude = {};
  if (query.includeAlerts) include.alerts = true;
  if (query.includeServices) include.services = true;

  return await paginate(
    prisma.device,
    {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    },
    where,
    Object.keys(include).length > 0 ? include : undefined,
  );
};

export const streamAllDevicesService = (query: {
  ip?: string;
  hostName?: string;
  createdAt?: string;
}) => {
  const where = buildDeviceFilter(query as any);
  return createPrismaStream(prisma.device, where, 3);
};
