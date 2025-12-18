import { CreateDevideInput } from './device.validation';
import { prisma } from '../../config/postgres';
import ApiErrorHandler from '../../common/utils/ApiErrorHandler';
import { STATUS_CODE, PRISMA_ERROR } from '../../common/constants/constants';
import logger from '../../common/utils/logger';

export const createDevice = async (data: CreateDevideInput) => {
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

    logger.error(`Database error in createDevice: ${error.message}`, {
      stack: error.stack,
    });
    throw error;
  }
};
