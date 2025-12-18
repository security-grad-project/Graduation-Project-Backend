import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../common/utils/catchAsync';
import { createDeviceValidation } from './device.validation';
import * as deviceService from './device.service';
import { STATUS_CODE } from '../../common/constants/responceCode';
import { STATUS } from '../../common/constants/responseStatus';
import logger from '../../common/utils/logger';

export const createDevice = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const validatedData = createDeviceValidation.parse(req.body);

  const device = await deviceService.createDevice(validatedData);

  logger.info(`Device created successfully: ID ${device.id}`);

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    data: device,
  });
});
