import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import { createDashboardData } from '../types/types';
import { createDashboardService } from '../services/dashboard.service';
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
