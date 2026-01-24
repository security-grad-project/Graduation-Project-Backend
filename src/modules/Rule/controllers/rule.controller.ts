import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { createRuleData, updateRuleData } from '../types/types';
import { createRuleService, updateRuleService } from '../services/rule.service';
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
