import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import * as serviceService from '../services/service.service';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import logger from '../../../common/utils/logger';
import { CreateServiceDto } from '../dto/create-service.dto';
import { updateServiceDto } from '../dto/update-service.dto';
import { ListServicesQueryDto } from '../dto/list-service-query.dto';

export const createService = catchAsync(async (req: Request, res: Response) => {
  const data: CreateServiceDto = req.body as CreateServiceDto;
  const service = await serviceService.createService(data);

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    message: 'Service created successfully',
    data: service,
  });
});

export const updateService = catchAsync(async (req: Request, res: Response) => {
  const data: updateServiceDto = req.body as updateServiceDto;
  const id = req.params.id;
  // @ts-ignore
  const service = await serviceService.updateService(id, data);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    message: 'Service updated successfully',
    data: service,
  });
});

export const getServiceById = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const { includeDeviceData, includeUserData } = req.query;
  // @ts-ignore
  const service = await serviceService.getServiceByIdService(serviceId, {
    includeDeviceData: includeDeviceData === 'true',
    includeUserData: includeUserData === 'true',
  });

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    service: service,
  });
});

export const listServices = catchAsync(async (req: Request, res: Response) => {
  const query: ListServicesQueryDto = req.query as unknown as ListServicesQueryDto;

  const services = await serviceService.getAllServices(query);
  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: services.data,
    meta: services.meta,
  });
});

export const streamService = catchAsync(async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  const query = req.query as unknown as ListServicesQueryDto;
  const dataStream = serviceService.streamAllServicesService(query);

  req.on('close', () => {
    dataStream.destroy();
  });

  dataStream.pipe(res);

  dataStream.on('error', (err) => {
    console.error('Stream error:', err);
    res.end();
  });
});

export const deleteService = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.id as string;
  await serviceService.deleteServiceService(serviceId);
  res.status(STATUS_CODE.NO_CONTENT).send();
});

export const countServices = catchAsync(async (req: Request, res: Response) => {
  const query: ListServicesQueryDto = req.query as unknown as ListServicesQueryDto;

  const count = await serviceService.countServiceService(query);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: { count },
  });
});

export const getServiceByUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const query = {
    ...req.query,
    userId,
  } as unknown as ListServicesQueryDto;

  const services = await serviceService.getAllServices(query);
  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: services.data,
    meta: services.meta,
  });
});

export const getServiceByDevice = catchAsync(async (req: Request, res: Response) => {
  const { deviceId } = req.params;
  const query = {
    ...req.query,
    deviceId,
  } as unknown as ListServicesQueryDto;

  const services = await serviceService.getAllServices(query);
  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: services.data,
    meta: services.meta,
  });
});
