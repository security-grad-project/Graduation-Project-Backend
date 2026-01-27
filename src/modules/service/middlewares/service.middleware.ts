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
    next();
  } catch (err) {
    next(err);
  }
};
