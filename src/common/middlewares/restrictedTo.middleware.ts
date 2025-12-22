import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import ApiErrorHandler from '../utils/ApiErrorHandler';
import { IRequest } from '../interfaces/types';
import { STATUS_CODE } from '../constants/responseCode';
import catchAsync from '../utils/catchAsync';

export const restrictedTo = (...allwoedRoles: Role[]) =>
  catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
    if (!allwoedRoles.includes(req.user?.role as Role)) {
      return next(
        new ApiErrorHandler(
          STATUS_CODE.FORBIDDEN,
          'You do not have permission to perform this action',
        ),
      );
    }
    next();
  });
