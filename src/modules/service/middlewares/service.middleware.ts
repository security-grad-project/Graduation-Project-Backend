import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../config/postgres';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { STATUS_CODE } from '../../../common/constants/responseCode';

export const checkServiceExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const service = await prisma.service.findUnique({ where: { id } });

    if (!service) {
      return next(new ApiErrorHandler(STATUS_CODE.NOT_FOUND, `Service with ID ${id} not found`));
    }

    res.locals.service = service;
    next();
  } catch (err) {
    next(err);
  }
};

export const authorizeServiceAccess = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as Request & { user: { id: string; role: string } }).user;
    if (!user) {
      return next(new ApiErrorHandler(STATUS_CODE.UNAUTHORIZED, 'User context missing'));
    }

    const service = res.locals.service;
    if (!service) {
      return next(
        new ApiErrorHandler(STATUS_CODE.INTERNAL_SERVER_ERROR, 'Service context missing'),
      );
    }

    if (user.role === 'SOC_ADMIN') {
      return next();
    }

    if (service.userId !== user.id) {
      return next(
        new ApiErrorHandler(
          STATUS_CODE.FORBIDDEN,
          'You do not have permission to access this service',
        ),
      );
    }
    next();
  } catch (err) {
    next(err);
  }
};
