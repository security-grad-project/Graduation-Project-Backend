import { STATUS } from '../constants/responseStatus';

class ApiErrorHandler extends Error {
  readonly status: string;
  readonly statusCode: number;
  readonly isOperational: boolean;
  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? STATUS.FAIL : STATUS.SUCCESS;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiErrorHandler;
