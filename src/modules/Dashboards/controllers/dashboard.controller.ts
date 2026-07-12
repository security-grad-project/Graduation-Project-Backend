import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import {
  createDashboardData,
  DashboardDataQuery,
  ListDashboardsQuery,
  updateDashboardData,
} from '../types/types';
import {
  createDashboardService,
  updateDashboardService,
  deleteDashboardService,
  getDashboardService,
  getAllDashboardsService,
  getDashboardDataService,
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

export const getDashboardById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const dashboard = await getDashboardService(id);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: dashboard,
    message: 'Dashboard retrieved successfully',
  });
});

export const getAllDashboards = catchAsync(async (req: Request, res: Response) => {
  const query: ListDashboardsQuery = req.query as unknown as ListDashboardsQuery;
  const dashboards = await getAllDashboardsService(query);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: dashboards.data,
    meta: dashboards.meta,
  });
});

export const getDashboardData = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const query: DashboardDataQuery = req.query as unknown as DashboardDataQuery;
  const data = await getDashboardDataService(id, query);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data,
    message: 'Dashboard data retrieved successfully',
  });
});
