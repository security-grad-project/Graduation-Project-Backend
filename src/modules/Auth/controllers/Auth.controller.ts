import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import logger from '../../../common/utils/logger';
import { signupService } from '../services/Auth.service';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const analyst = await signupService(req.body);

    logger.info('analyst signned up successfully', { Email: analyst.email });

    res.status(201).json({
      status: 'success',
      data: analyst,
    });
  },
);
