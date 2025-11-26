import { Request, Response, NextFunction } from 'express';
import env from '../../config/env';
import logger from '../utils/logger';

const sendDevelopmentError = (err: any, req: Request, res: Response) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProductionError = (err: any, req: Request, res: Response) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(err.statusCode).json({
      status: 'ERROR',
      message: 'Something went wrong',
    });
  }
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'FAIL';
  if (env.NODE_ENV === 'development') {
    sendDevelopmentError(err, req, res);
  } else if (env.NODE_ENV === 'production') {
    sendProductionError(err, req, res);
  }

  next();
};
