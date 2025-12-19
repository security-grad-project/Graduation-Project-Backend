import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import {
  createDeviceRequestValidation,
  updateDeviceQueryValidation,
  listDevicesQueryValidation,
} from '../validation/device.validation';
import * as deviceService from '../services/device.service';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import logger from '../../../common/utils/logger';
import { buildDeviceFilter } from '../services/device.utils';

export const createDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createDeviceRequestValidation.parse(req.body);

  const device = await deviceService.createDeviceService(validatedData);

  logger.info(`Device created successfully: ID ${device.id}`);

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    message: 'Device created successfully',
    data: device,
  });
});

export const getDeviceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
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

export const updateDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const deviceId = req.params.id;
  const validatedData = updateDeviceQueryValidation.parse(req.body);
  const device = await deviceService.updateDeviceService(deviceId, validatedData);

  logger.info(`Device updated successfully: ID ${deviceId}`);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    message: 'Device updated successfully',
    data: device,
  });
});

export const deleteDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const deviceId = req.params.id;
  await deviceService.deleteDeviceService(deviceId);
  res.status(STATUS_CODE.NO_CONTENT).send();
});

export const listDevices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = listDevicesQueryValidation.parse(req.query);
  const data = await deviceService.listDevicesService(validatedData);
  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: data.devices,
    meta: data.metaData,
  });
});

export const streamDevices = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = listDevicesQueryValidation.parse(req.query);

  res.setHeader('Content-Type', 'application/json');

  const dataStream = deviceService.streamAllDevicesService(validatedData);

  req.on('close', () => {
    dataStream.destroy();
  });

  dataStream.pipe(res);

  dataStream.on('error', (err) => {
    console.error('Stream error:', err);
    res.end();
  });
});
