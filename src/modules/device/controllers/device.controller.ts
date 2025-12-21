import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import * as deviceService from '../services/device.service';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import logger from '../../../common/utils/logger';

export const createDevice = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const device = await deviceService.createDeviceService(data);

  logger.info(`Device created successfully: ID ${device.id}`);

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    message: 'Device created successfully',
    data: device,
  });
});

export const getDeviceById = catchAsync(async (req: Request, res: Response) => {
  const deviceId = req.params.id;
  const { includeServices, includeAlerts } = req.query;
  const device = await deviceService.getDeviceByIdService(deviceId, {
    includeServices: includeServices === 'true',
    includeAlerts: includeAlerts === 'true',
  });

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: device,
  });
});

export const updateDevice = catchAsync(async (req: Request, res: Response) => {
  const deviceId = req.params.id;
  const data = req.body;
  const device = await deviceService.updateDeviceService(deviceId, data);

  logger.info(`Device updated successfully: ID ${deviceId}`);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    message: 'Device updated successfully',
    data: device,
  });
});

export const deleteDevice = catchAsync(async (req: Request, res: Response) => {
  const deviceId = req.params.id;
  await deviceService.deleteDeviceService(deviceId);
  res.status(STATUS_CODE.NO_CONTENT).send();
});

export const listDevices = catchAsync(async (req: Request, res: Response) => {
  const query = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    sortBy: (req.query.sortBy as string) || 'createdAt',
    sortOrder: ((req.query.sortOrder as string) || 'desc') as 'asc' | 'desc',
    userId: (req.query.userId as string) || undefined,
    ip: (req.query.ip as string) || undefined,
    hostName: (req.query.hostName as string) || undefined,
  };
  const result = await deviceService.listDevicesService(query);
  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: result.data,
    meta: result.meta,
  });
});

export const streamDevices = catchAsync(async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');

  const query = {
    userId: (req.query.userId as string) || undefined,
    ip: (req.query.ip as string) || undefined,
    hostName: (req.query.hostName as string) || undefined,
  };

  const dataStream = deviceService.streamAllDevicesService(query);

  req.on('close', () => {
    dataStream.destroy();
  });

  dataStream.pipe(res);

  dataStream.on('error', (err) => {
    console.error('Stream error:', err);
    res.end();
  });
});
