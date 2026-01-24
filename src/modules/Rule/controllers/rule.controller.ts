import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { createRuleData } from '../types/types';
import { createRuleService } from '../services/rule.service';
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
