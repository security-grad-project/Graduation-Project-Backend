import { Prisma } from '@prisma/client';
import {
  CreateDeviceRequestInput,
  listDevicesQueryInput,
  UpdateDeviceQueryInput,
} from '../validation/device.validation';
import { prisma } from '../../../config/postgres';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { STATUS_CODE, PRISMA_ERROR } from '../../../common/constants/constants';
import { DeviceQueryOptions as GetDeviceQueryOptions } from '../types/device.types';
import logger from '../../../common/utils/logger';
import { buildDeviceFilter } from './device.utils';

export const createDeviceService = async (data: CreateDeviceRequestInput) => {
  try {
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
  } catch (error: any) {
    if (error.code === PRISMA_ERROR.ForeignKeyConstraint) {
      logger.warn(`Failed to create device: User ${data.userId} does not exist.`);

      throw new ApiErrorHandler(STATUS_CODE.NOT_FOUND, 'User not found');
    }

    logger.error(`Database error in createDevice: ${error.message}`);
    throw error;
  }
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
    logger.warn(`Get device failed: Device ID ${id} not found.`);
    throw new ApiErrorHandler(STATUS_CODE.NOT_FOUND, 'Device not found');
  }
  return device;
};

export const updateDeviceService = async (id: string, data: UpdateDeviceQueryInput) => {
  try {
    const device = await prisma.device.update({
      where: {
        id: id,
      },
      data,
    });
    logger.info(`Device updated successfully: ID ${id}`);
    return device;
  } catch (error: any) {
    if (error.code === PRISMA_ERROR.RecordNotFound) {
      logger.warn(`Update device failed: Device ID ${id} not found.`);
      throw new ApiErrorHandler(STATUS_CODE.NOT_FOUND, 'Device not found');
    }
    logger.error(`Database error in updateDevice: ${error.message}`);
    throw error;
  }
};

export const deleteDeviceService = async (id: string) => {
  try {
    await prisma.device.delete({ where: { id: id } });

    logger.info(`Device deleted successfully: ID ${id}`);
  } catch (error: any) {
    if (error.code === PRISMA_ERROR.ForeignKeyConstraint) {
      logger.warn(`Delete blocked: Device ${id} has active services or alerts.`);
      throw new ApiErrorHandler(
        STATUS_CODE.CONFLICT,
        'Cannot delete device: It has active services or alerts associated with it.',
      );
    }
    if (error.code === PRISMA_ERROR.RecordNotFound) {
      logger.warn(`Delete device failed: Device ID ${id} not found.`);
      throw new ApiErrorHandler(STATUS_CODE.NOT_FOUND, 'Device not found');
    }
    logger.error(`Database error in deleteDevice: ${error.message}`);
    throw error;
  }
};

export const listDevicesService = async (query: listDevicesQueryInput) => {
  const where = buildDeviceFilter(query);
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const [total, devices] = await prisma.$transaction([
    prisma.device.count({ where }),
    prisma.device.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    metaData: {
      devices_count: total,
      page,
      limit,
    },
    devices,
  };
};
