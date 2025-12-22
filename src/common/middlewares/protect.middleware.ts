import { Response, NextFunction } from 'express';
import { prisma } from '../../config/postgres';
import ApiErrorHandler from '../utils/ApiErrorHandler';
import { IRequest, ITokenPayload } from '../interfaces/types';
import catchAsync from '../utils/catchAsync';
import { STATUS_CODE } from '../constants/responseCode';
import * as jwtHelper from '../utils/jwtTokens';

// protect middleware
export default catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiErrorHandler(STATUS_CODE.UNAUTHORIZED, 'Please login to access this route'));
  }

  const token = authHeader.split(' ')[1];

  const decoded: ITokenPayload = await jwtHelper.verifyToken(token);

  const analyst = await prisma.analyst.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!analyst) {
    return next(
      new ApiErrorHandler(
        STATUS_CODE.UNAUTHORIZED,
        'The analyst belonging to this token no longer exists',
      ),
    );
  }

  req.user = analyst;
  next();
});
