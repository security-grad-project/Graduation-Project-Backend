import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { prisma } from '../../../config/postgres';
import { ListAlertsQuery, updateAlertStatusData, AlertStatsQuery } from '../types/types';
import {
  getAllAlertsService,
  getAlertService,
  updateAlertStatusService,
  getAlertStatsService,
} from '../services/alert.service';
import { STATUS, STATUS_CODE } from '../../../common/constants/constants';

export const getAllAlerts = catchAsync(async (req: Request, res: Response) => {
  const query: ListAlertsQuery = req.query as unknown as ListAlertsQuery;
  const alerts = await getAllAlertsService(query);
  res
    .status(STATUS_CODE.SUCCESS)
    .json({ status: STATUS.SUCCESS, data: alerts.data, meta: alerts.meta });
});

export const getAlertById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const alert = await getAlertService(id);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: alert,
    message: 'Alert retrieved successfully',
  });
});

export const updateAlertStatus = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data: updateAlertStatusData = req.body as updateAlertStatusData;
  const alert = await updateAlertStatusService(id, data);

  res
    .status(STATUS_CODE.SUCCESS)
    .json({ status: STATUS.SUCCESS, data: alert, message: 'Alert status updated successfully' });
});

export const getAlertStats = catchAsync(async (req: Request, res: Response) => {
  const query: AlertStatsQuery = req.query as unknown as AlertStatsQuery;
  const stats = await getAlertStatsService(query);

  res
    .status(STATUS_CODE.SUCCESS)
    .json({ status: STATUS.SUCCESS, data: stats, message: 'Alert stats retrieved successfully' });
});
