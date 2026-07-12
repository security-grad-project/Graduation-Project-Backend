import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import * as logSourceService from '../services/logSource.service';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import { CreateLogSourceDto, UpdateLogSourceDto, ListLogSourcesQueryDto } from '../dto';

export const createLogSource = catchAsync(async (req: Request, res: Response) => {
  const data: CreateLogSourceDto = req.body as CreateLogSourceDto;
  const logSource = await logSourceService.createLogSourceService(data);

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    data: logSource,
    message: 'Log source created successfully',
  });
});

export const getLogSourceById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const logSource = await logSourceService.getLogSourceByIdService(id);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: logSource,
  });
});

export const updateLogSource = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data: UpdateLogSourceDto = req.body as UpdateLogSourceDto;
  const logSource = await logSourceService.updateLogSourceService(id, data);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: logSource,
    message: 'Log source updated successfully',
  });
});

export const listLogSources = catchAsync(async (req: Request, res: Response) => {
  const query: ListLogSourcesQueryDto = req.query as unknown as ListLogSourcesQueryDto;
  const result = await logSourceService.listLogSourcesService(query);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: result.data,
    meta: result.meta,
  });
});
