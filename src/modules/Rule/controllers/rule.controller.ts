import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import {
  countRulesQuery,
  createRuleData,
  ListRulesQuery,
  RulesByType,
  updateRuleData,
} from '../types/types';
import {
  createRuleService,
  deleteRuleService,
  getRuleService,
  getAllRulesService,
  updateRuleService,
  getRulesByTypesService,
  getRuleWithAlertsService,
  updateFullRuleService,
  countRulesService,
  duplicateRuleService,
} from '../services/rule.service';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';

export const createRule = catchAsync(async (req: Request, res: Response) => {
  const data: createRuleData = req.body as createRuleData;
  const rule = await createRuleService(data);

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    data: rule,
    message: 'Rule created successfully',
  });
});

export const updateRule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data: updateRuleData = req.body as updateRuleData;
  const rule = await updateRuleService(id, data);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: rule,
    message: 'Rule updated successfully',
  });
});

export const deleteRule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  await deleteRuleService(id);
  res.status(STATUS_CODE.NO_CONTENT).send();
});

export const getRuleById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const rule = await getRuleService(id);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: rule,
    message: 'Rule got successfully',
  });
});

export const getAllRules = catchAsync(async (req: Request, res: Response) => {
  const query: ListRulesQuery = req.query as unknown as ListRulesQuery;
  const rules = await getAllRulesService(query);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: rules.data,
    meta: rules.meta,
  });
});

export const getRulesByType = catchAsync(async (req: Request, res: Response) => {
  const type = req.params.type;
  const query: RulesByType = req.query as unknown as RulesByType;
  const rules = await getRulesByTypesService(type, query);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: rules.data,
    meta: rules.meta,
  });
});

export const getRuleWithAllAlerts = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const rule = await getRuleWithAlertsService(id);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: rule,
    message: 'Rule got successfully',
  });
});

export const updateFullRule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data: createRuleData = req.body as createRuleData;
  const rule = await updateFullRuleService(id, data);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: rule,
    message: 'Rule updated successfully',
  });
});

export const getStats = catchAsync(async (req: Request, res: Response) => {
  const query: countRulesQuery = req.query as countRulesQuery;
  const stats = await countRulesService(query);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: stats,
    message: 'Rules stats got successfully',
  });
});

export const duplicateRule = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const name = req.body.name;
  const rule = await duplicateRuleService(id, name);

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    data: rule,
    message: 'Rule duplicated successfully',
  });
});
