import { NextFunction, Request, Response } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { STATUS, STATUS_CODE } from '../constants/constants';
import { fromError } from 'zod-validation-error';
import logger from '../utils/logger';

function parse<T>(schema: ZodSchema<T>, vData: unknown, res: Response): T | undefined {
  const result = schema.safeParse(vData);
  if (!result.success) {
    const error: ZodError = result.error;
    const validationError = fromError(error);
    res.status(STATUS_CODE.BAD_REQUEST).json({
      status: STATUS.ERROR,
      message: 'Validation failed',
      errors: validationError.toString(),
    });
    logger.error('Validation failed', {
      errors: validationError,
    });
    return undefined;
  }
  return result.data;
}

export default <B, R, Q, P>(schema: {
  body?: ZodSchema<B>;
  response?: ZodSchema<R>;
  query?: ZodSchema<Q>;
  params?: ZodSchema<P>;
}) => {
  return (req: Request<P, R, B, Q>, res: Response, next: NextFunction) => {
    Object.defineProperty(req, 'params', {
      value: req.params,
      writable: true,
    });
    Object.defineProperty(req, 'query', {
      value: req.query,
      writable: true,
    });
    Object.defineProperty(req, 'body', {
      value: req.body,
      writable: true,
    });

    if (schema.params) {
      const validatedParams = parse(schema.params, req.params, res);
      if (validatedParams === undefined) {
        return;
      }
      req.params = validatedParams;
    }

    if (schema.query) {
      const validatedQuery = parse(schema.query, req.query, res);
      if (validatedQuery === undefined) {
        return;
      }
      req.query = validatedQuery;
    }

    if (schema.body) {
      const validatedBody = parse(schema.body, req.body, res);
      if (validatedBody === undefined) {
        return;
      }
      req.body = validatedBody;
    }

    next();
  };
};
