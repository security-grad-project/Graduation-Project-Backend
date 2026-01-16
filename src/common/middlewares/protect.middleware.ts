import { Response, NextFunction } from 'express';
import { prisma } from '../../config/postgres';
import ApiErrorHandler from '../utils/ApiErrorHandler';
import { IRequest, ITokenPayload } from '../interfaces/types';
import catchAsync from '../utils/catchAsync';
import { STATUS_CODE } from '../constants/responseCode';
import { verifyAccessToken } from '../../modules/Auth/services/token.service';
import { isTokenBlacklisted } from '../../modules/Auth/services/blacklist.service';

export const extractBearerToken = (authHeader: string | undefined): string | null => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

export const authenticate = catchAsync(async (req: IRequest, res: Response, next: NextFunction) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(new ApiErrorHandler(STATUS_CODE.UNAUTHORIZED, 'Please login to access this route'));
  }

  const blacklisted = await isTokenBlacklisted(token);
  if (blacklisted) {
    return next(
      new ApiErrorHandler(STATUS_CODE.UNAUTHORIZED, 'Token has been revoked. Please login again.'),
    );
  }

  const decoded: ITokenPayload = await verifyAccessToken(token);

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
  req.accessToken = token;
  next();
});

export default authenticate;
