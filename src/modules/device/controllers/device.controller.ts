import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { createDeviceValidation } from '../validation/device.validation';
import * as deviceService from '../services/device.service';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import logger from '../../../common/utils/logger';
import { json } from 'zod';

export const createDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createDeviceValidation.parse(req.body);

  const device = await deviceService.createDevice(validatedData);

  logger.info(`Device created successfully: ID ${device.id}`);

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    data: device,
  });
});

export const getDeviceById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const deviceId = req.params.id;
  const { includeServices, includeAlerts } = req.query;
  const device = await deviceService.getDeviceById(deviceId, {
    includeServices: includeServices === 'true',
    includeAlerts: includeAlerts === 'true',
  });

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: device,
  });
});
