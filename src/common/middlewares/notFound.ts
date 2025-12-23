import { Request, Response } from 'express';
import { STATUS_CODE, STATUS } from '../constants/constants';
import logger from '../utils/logger';

export const notFound = (req: Request, res: Response) => {
  logger.error(`Route cannot be found`, {
    route: req.originalUrl,
    status: STATUS.ERROR,
    statusCode: STATUS_CODE.NOT_FOUND,
  });
  res.status(STATUS_CODE.NOT_FOUND).json({
    status: STATUS.ERROR,
    message: `Route ${req.originalUrl} cannot be found`,
  });
};
