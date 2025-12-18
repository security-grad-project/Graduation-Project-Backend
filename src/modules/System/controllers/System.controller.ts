import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import { prisma } from '../../../config/postgres';

export const status = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const analysts = await prisma.analyst.count();

  const isFirstRun = analysts === 0;

  res.status(200).json({
    status: 'success',
    isFirstRun,
  });
});
