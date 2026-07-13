import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import {
  runHuntingQueryService,
  getSavedQueriesService,
  createSavedQueryService,
  updateSavedQueryService,
  deleteSavedQueryService,
} from '../services/hunting.service';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import {
  RunQueryDto,
  createSavedQueryData,
  updateSavedQueryData,
  ListSavedQueriesQuery,
} from '../types/types';

export const executeQuery = catchAsync(async (req: Request, res: Response) => {
  const result = await runHuntingQueryService(req.body as RunQueryDto);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: result,
    message: 'Hunting query executed successfully',
  });
});

export const getSavedQueries = catchAsync(async (req: Request, res: Response) => {
  const pageRaw = Number(req.query.page);
  const limitRaw = Number(req.query.limit);


  const query: ListSavedQueriesQuery = {
    ...req.query,
    page: Number.isFinite(pageRaw) && pageRaw >= 1 ? Math.floor(pageRaw) : 1,
    limit: Number.isFinite(limitRaw) && limitRaw >= 1 ? Math.min(Math.floor(limitRaw), 100) : 10,
  } as unknown as ListSavedQueriesQuery;
  const queries = await getSavedQueriesService(query);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: queries.data,
    meta: queries.meta,
  });
});

export const createSavedQuery = catchAsync(async (req: Request, res: Response) => {
  const data: createSavedQueryData = req.body as createSavedQueryData;
  const query = await createSavedQueryService(data);

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    data: query,
    message: 'Saved query created successfully',
  });
});

export const updateSavedQuery = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const data: updateSavedQueryData = req.body as updateSavedQueryData;
  const query = await updateSavedQueryService(id, data);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: query,
    message: 'Saved query updated successfully',
  });
});

export const deleteSavedQuery = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await deleteSavedQueryService(id);

  res.status(STATUS_CODE.NO_CONTENT).send();
});
