import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import ApiErrorHandler from '../utils/ApiErrorHandler';
import { IRequest } from '../interfaces/types';
import { STATUS_CODE } from '../constants/responseCode';

export const authorize = (...allowedRoles: Role[]) => {
  return (req: IRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new ApiErrorHandler(STATUS_CODE.UNAUTHORIZED, 'Please login to access this route'),
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiErrorHandler(
          STATUS_CODE.FORBIDDEN,
          'You do not have permission to perform this action',
        ),
      );
    }
    next();
  };
};

export const restrictedTo = authorize;
