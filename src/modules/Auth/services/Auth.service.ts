import { Request, Response } from 'express';
import ms from 'ms';
import { LoginData, SignupData, AnalystResponse, LoginContext } from '../types/types';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { prisma } from '../../../config/postgres';
import { hashPassword, comparePassword } from '../../../common/utils/primsa-util';
import { STATUS_CODE } from '../../../common/constants/constants';
import config from '../../../config/env';
import { generateAccessToken } from './token.service';
import {
  createRefreshToken,
  validateRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllAnalystTokens,
  getActiveSessions,
} from './refresh.service';
import { blacklistAccessToken } from './blacklist.service';

export const getLoginContext = (req: Request): LoginContext => ({
  userAgent: req.headers['user-agent'],
  ipAddress: req.ip || req.socket.remoteAddress,
});

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ms(config.REFRESH_TOKEN_EXPIRED_IN),
    path: '/api/v1/auth',
  });
};

export const clearRefreshTokenCookie = (res: Response): void => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/v1/auth',
  });
};

const sanitizeAnalyst = (analyst: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  password: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}): AnalystResponse => {
  return {
    id: analyst.id,
    email: analyst.email,
    firstName: analyst.firstName,
    lastName: analyst.lastName,
    phoneNumber: analyst.phoneNumber,
    role: analyst.role,
    lastLogin: analyst.lastLogin,
    createdAt: analyst.createdAt,
    updatedAt: analyst.updatedAt,
  };
};

export const signupService = async (data: SignupData): Promise<AnalystResponse> => {
  const { email, password, firstName, lastName, phoneNumber } = data;

  const existingAnalyst = await prisma.analyst.findUnique({ where: { email } });
  if (existingAnalyst) {
    throw new ApiErrorHandler(STATUS_CODE.CONFLICT, 'An account with this email already exists');
  }

  const hashedPassword = await hashPassword(password);

  const analyst = await prisma.analyst.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
    },
  });

  if (!analyst) {
    throw new ApiErrorHandler(
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      'Something went wrong while signing up',
    );
  }

  return sanitizeAnalyst(analyst);
};

export const loginService = async (
  data: LoginData,
  context?: LoginContext,
): Promise<{ analyst: AnalystResponse; accessToken: string; refreshToken: string }> => {
  const { email, password } = data;

  const analyst = await prisma.analyst.findUnique({ where: { email } });

  if (!analyst) {
    throw new ApiErrorHandler(STATUS_CODE.UNAUTHORIZED, 'Invalid email or password');
  }

  const isPasswordMatched = await comparePassword(password, analyst.password);
  if (!isPasswordMatched) {
    throw new ApiErrorHandler(STATUS_CODE.UNAUTHORIZED, 'Invalid email or password');
  }

  const updatedAnalyst = await prisma.analyst.update({
    where: { id: analyst.id },
    data: { lastLogin: new Date() },
  });

  const accessToken = generateAccessToken(analyst.id, { role: analyst.role });

  const { token: refreshToken } = await createRefreshToken({
    analystId: analyst.id,
    userAgent: context?.userAgent,
    ipAddress: context?.ipAddress,
  });

  return { analyst: sanitizeAnalyst(updatedAnalyst), accessToken, refreshToken };
};

export const refreshTokenService = async (
  refreshToken: string,
  context?: LoginContext,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const tokenRecord = await validateRefreshToken(refreshToken);

  const newAccessToken = generateAccessToken(tokenRecord.analyst.id, {
    role: tokenRecord.analyst.role,
  });

  const { token: newRefreshToken } = await rotateRefreshToken(
    refreshToken,
    tokenRecord.analyst.id,
    context?.userAgent,
    context?.ipAddress,
  );

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutService = async (accessToken: string, refreshToken?: string): Promise<void> => {
  await blacklistAccessToken(accessToken);

  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }
};

export const logoutAllService = async (analystId: string, accessToken: string): Promise<void> => {
  await blacklistAccessToken(accessToken);

  await revokeAllAnalystTokens(analystId);
};

export const getActiveSessionsService = async (analystId: string) => {
  return getActiveSessions(analystId);
};
