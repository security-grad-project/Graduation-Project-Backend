import { CreateDeviceDto, UpdateDeviceDto, ListDevicesQueryDto } from '../dto';
import { prisma } from '../../../config/postgres';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { STATUS_CODE } from '../../../common/constants/constants';
import { DeviceQueryOptions as GetDeviceQueryOptions } from '../types/device.types';
import logger from '../../../common/utils/logger';
import { buildDeviceFilter } from './device.utils';
import { createPrismaStream, paginate } from '../../../common/utils/util';

export const createDeviceService = async (data: CreateDeviceDto) => {
  const device = await prisma.device.create({
    data: {
      ip: data.ip,
      hostName: data.hostName,
      port: data.port,
      userId: data.userId,
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
    userId: query.userId,
    ip: query.ip,
    hostName: query.hostName,
  } as any);

  return await paginate(
    prisma.device,
    {
      page: query.page,
      limit: query.limit,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    },
    where,
  );
};

export const streamAllDevicesService = (query: {
  userId?: string;
  ip?: string;
  hostName?: string;
}) => {
  const where = buildDeviceFilter(query as any);
  return createPrismaStream(prisma.device, where, 3);
};
