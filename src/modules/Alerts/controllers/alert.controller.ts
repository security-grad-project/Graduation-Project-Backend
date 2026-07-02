import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { prisma } from '../../../config/postgres';
import { ListAlertsQuery } from '../types/types';
import { getAllAlertsService } from '../services/alert.service';
import { STATUS, STATUS_CODE } from '../../../common/constants/constants';

export const getAllAlerts = catchAsync(async (req: Request, res: Response) => {
  const query: ListAlertsQuery = req.query as unknown as ListAlertsQuery;
  const alerts = await getAllAlertsService(query);
  res
    .status(STATUS_CODE.SUCCESS)
    .json({ status: STATUS.SUCCESS, data: alerts.data, meta: alerts.meta });
});

export const createAlert = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const alert = await prisma.alert.create({ data });
  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    data: alert,
    message: 'Alert created successfully',
  });
});
