import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { runHuntingQueryService } from '../services/hunting.service';
import { STATUS_CODE } from '../../../common/constants/responseCode';
import { STATUS } from '../../../common/constants/responseStatus';
import { RunQueryDto } from '../types/types';

export const executeQuery = catchAsync(async (req: Request, res: Response) => {
  const result = await runHuntingQueryService(req.body as RunQueryDto);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: result,
  });
});
