import { CreateDeviceInput, UpdateDeviceInput } from '../validation/device.validation';
import { prisma } from '../../../config/postgres';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { STATUS_CODE, PRISMA_ERROR } from '../../../common/constants/constants';
import { DeviceQueryOptions } from '../types/device.types';
import logger from '../../../common/utils/logger';
import { de } from 'zod/v4/locales';

export const createDeviceService = async (data: CreateDeviceInput) => {
  try {
    const device = await prisma.device.create({
      data: {
        ip: data.ip,
        hostName: data.hostName,
        port: data.port,
        userId: data.userId,
      },
    });

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

export const getDeviceByIdService = async (id: string, options: DeviceQueryOptions = {}) => {
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

export const updateDeviceService = async (id: string, data: UpdateDeviceInput) => {
  try {
    const device = await prisma.device.update({
      where: {
        id: id,
      },
      data,
    });
    return device;
  } catch (error: any) {
    if (error.code === PRISMA_ERROR.RecordNotFound) {
      throw new ApiErrorHandler(STATUS_CODE.NOT_FOUND, 'Device not found');
    }
    logger.error(`Database error in updateDevice: ${error.message}`);
    throw error;
  }
};
