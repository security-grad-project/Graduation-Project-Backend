import { prisma } from '../../../config/postgres';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { STATUS_CODE } from '../../../common/constants/constants';
import { CreateServiceDto } from '../dto/create-service.dto';
import logger from '../../../common/utils/logger';

export const createService = async (data: CreateServiceDto) => {
  const service = await prisma.service.create({
    data: {
      type: data.type,
      userId: data.userId,
      deviceId: data.deviceId,
    },
  });

  logger.info(`Service created successfully: ID ${service.id}`);
  return service;
};

export const updateService = async (id: string, data: CreateServiceDto) => {
  const service = await prisma.service.update({
    data: {
      ...data,
    },
    where: {
      id,
    },
  });

  logger.info(`Service updated successfully: ID ${service.id}`);
  return service;
};
