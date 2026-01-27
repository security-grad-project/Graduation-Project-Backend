import { prisma } from '../../../config/postgres';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { STATUS_CODE } from '../../../common/constants/constants';
import { CreateServiceDto } from '../dto/create-service.dto';
import logger from '../../../common/utils/logger';
import { GetServiceQueryOptions } from '../types/service.types';
import { ListServicesQueryDto } from '../dto/list-service-query.dto';
import { buildServiceFilter } from './service.util';
import { Prisma } from '@prisma/client';
import { createPrismaStream, paginate } from '../../../common/utils/primsa-util';

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

export const getServiceByIdService = async (id: string, options: GetServiceQueryOptions = {}) => {
  const { includeUserData, includeDeviceData } = options;
  const service = await prisma.service.findUnique({
    where: { id },
    include: { user: includeUserData, device: includeDeviceData },
  });

  if (!service) {
    throw new ApiErrorHandler(STATUS_CODE.NOT_FOUND, 'Service not found');
  }
  return service;
};

export const getAllServices = async (query: ListServicesQueryDto) => {
  const where = buildServiceFilter(query);

  const include: Prisma.ServiceInclude = {};
  if (query.includeDeviceData) include.device = true;
  if (query.includeUserData) include.user = true;

  return await paginate(
    // @ts-ignore
    prisma.service,
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

export const streamAllServicesService = (query: ListServicesQueryDto) => {
  const where = buildServiceFilter(query);
  return createPrismaStream(prisma.service, where, 3);
};

export const deleteServiceService = async (id: string) => {
  await prisma.service.delete({ where: { id } });
  logger.info(`Device deleted successfully: ID ${id}`);
};
