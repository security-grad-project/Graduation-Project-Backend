import { Request, Response } from 'express';
import { HTTP_STATUS, STATUS } from '../constants/constants';
import logger from '../utils/logger';

export const notFound = (req: Request, res: Response) => {
  logger.error(`Route cannot be found`, {
    route: req.originalUrl,
    status: STATUS.ERROR,
    statusCode: HTTP_STATUS.NOT_FOUND,
  });
  res.status(HTTP_STATUS.NOT_FOUND).json({
    status: STATUS.ERROR,
    message: `Route ${req.originalUrl} cannot be found`,
  });
};
