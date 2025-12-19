import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { createDeviceValidation, updateDeviceValidation } from '../validation/device.validation';
import * as deviceService from '../services/device.service';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import logger from '../../../common/utils/logger';
import { json } from 'zod';
import { stat } from 'fs';
import { status } from '../../System/controllers/System.controller';

export const createDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createDeviceValidation.parse(req.body);

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
  const validatedData = updateDeviceValidation.parse(req.body);
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
