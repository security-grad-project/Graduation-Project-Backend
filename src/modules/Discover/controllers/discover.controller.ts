import { Request, Response } from 'express';
import { discoverService } from '../services/discover.service';
import catchAsync from '../../../common/utils/catchAsync';

import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';

const getFields = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const fields = await discoverService.getFields();
  res.status(200).json({
    status: 'success',
    message: 'Discover fields fetched successfully',
    data: fields,
  });
});

const getFieldStats = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const field = req.query.field as string;

  if (!field) {
    throw new ApiErrorHandler(400, 'The "field" query parameter is required');
  }

  const stats = await discoverService.getFieldStats(field);

  res.status(200).json({
    status: 'success',
    message: 'Field stats fetched successfully',
    data: stats,
  });
});

export default {
  getFields,
  getFieldStats,
};
