import { Request, Response } from 'express';
import { HTTP_STATUS, STATUS } from '../constants/constants';

export const notFound = (req: Request, res: Response) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    status: STATUS.FAIL,
    message: `Route ${req.originalUrl} cannot be found`,
  });
};
