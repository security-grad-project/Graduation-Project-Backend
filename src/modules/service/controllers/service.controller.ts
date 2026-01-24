import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import * as serviceService from '../services/service.service';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import logger from '../../../common/utils/logger';
import { CreateServiceDto } from '../dto/create-service.dto';
import { updateServiceDto } from '../dto/update-service.dto';

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
