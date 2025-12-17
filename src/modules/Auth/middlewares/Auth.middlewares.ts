import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { prisma } from '../../../config/postgres';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';

export const allowOnlyFirstRun = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const analysts = await prisma.analyst.count();
    if (analysts !== 0) return next(new ApiErrorHandler(403, 'Signup is disabled. Please login.'));

    next();
  },
);
