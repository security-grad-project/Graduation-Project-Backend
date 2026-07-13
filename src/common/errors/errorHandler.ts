import { Request, Response, NextFunction } from 'express';
import env from '../../config/env';
import logger from '../utils/logger';
import ApiErrorHandler from '../utils/ApiErrorHandler';
import { STATUS_CODE, PRISMA_ERROR } from '../constants/constants';

const sendDevelopmentError = (
  err: any,
  statusCode: number,
  status: string,
  req: Request,
  res: Response,
) => {
  return res.status(statusCode).json({
    status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProductionError = (
  err: any,
  statusCode: number,
  status: string,
  isOperational: boolean,
  req: Request,
  res: Response,
) => {
  if (isOperational) {
    return res.status(statusCode).json({
      status,
      message: err.message,
    });
  } else {
    return res.status(statusCode).json({
      status: 'ERROR',
      message: 'Something went wrong',
    });
  }
};

const handlePrismaError = (err: any): ApiErrorHandler => {
  const errorCode = err.code;

  switch (errorCode) {
    case PRISMA_ERROR.RecordNotFound:
      return new ApiErrorHandler(STATUS_CODE.NOT_FOUND, 'Record not found');
    case PRISMA_ERROR.ForeignKeyConstraint:
      const isDeleteOperation =
        err.meta?.cause?.includes('delete') || err.message?.includes('delete');
      if (isDeleteOperation) {
        return new ApiErrorHandler(
          STATUS_CODE.CONFLICT,
          'Cannot delete: Record has active relationships',
        );
      }
      return new ApiErrorHandler(STATUS_CODE.NOT_FOUND, 'Related record not found');
    case PRISMA_ERROR.UniqueConstraint:
      return new ApiErrorHandler(STATUS_CODE.CONFLICT, 'Record already exists');
    default:
      return new ApiErrorHandler(STATUS_CODE.INTERNAL_SERVER_ERROR, 'Database error occurred');
  }
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.code && Object.values(PRISMA_ERROR).includes(err.code)) {
    err = handlePrismaError(err);
    logger.warn(`Prisma error handled: ${err.code} - ${err.message}`);
  }

  // Don't mutate err.statusCode/err.status directly — some errors (e.g. the
  // Elasticsearch client's ResponseError) define these as getter-only
  // accessors, and assigning to them throws and crashes this middleware.
  const isOperational = !!err.isOperational;
  const statusCode = isOperational && err.statusCode ? err.statusCode : 500;
  const status = isOperational && err.status ? err.status : 'FAIL';

  logger.error(err);

  if (env.NODE_ENV === 'development') {
    sendDevelopmentError(err, statusCode, status, req, res);
  } else {
    sendProductionError(err, statusCode, status, isOperational, req, res);
  }
};
