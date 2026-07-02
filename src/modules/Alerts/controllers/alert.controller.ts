import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { ListAlertsQuery } from '../types/types';
import { getAllAlertsService, getAlertService } from '../services/alert.service';
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
