import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/postgres';
import ApiErrorHandler from '../utils/ApiErrorHandler';
import { STATUS_CODE } from '../constants/responseCode';

export const checkUserExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.body;

    if (!userId) return next();

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return next(new ApiErrorHandler(STATUS_CODE.NOT_FOUND, `User with ID ${userId} not found`));
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const checkDeviceExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) return next();

    const device = await prisma.device.findUnique({ where: { id: deviceId } });

    if (!device) {
      return next(
        new ApiErrorHandler(STATUS_CODE.NOT_FOUND, `Device with ID ${deviceId} not found`),
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};
