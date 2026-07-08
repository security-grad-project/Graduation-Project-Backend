import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import { createDashboardData, updateDashboardData } from '../types/types';
import {
  createDashboardService,
  updateDashboardService,
  deleteDashboardService,
} from '../services/dashboard.service';
import { IRequest } from '../../../common/interfaces/types';

export const createDashboard = catchAsync(async (req: IRequest, res: Response) => {
  const data: createDashboardData = req.body as createDashboardData;
  const dashboard = await createDashboardService(req.user!.id, data);

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    data: dashboard,
    message: 'Dashboard created successfully',
  });
});

export const updateDashboard = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data: updateDashboardData = req.body as updateDashboardData;
  const dashboard = await updateDashboardService(id, data);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: dashboard,
    message: 'Dashboard updated successfully',
  });
});

export const deleteDashboard = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await deleteDashboardService(id);

  res.status(STATUS_CODE.NO_CONTENT).send();
});
