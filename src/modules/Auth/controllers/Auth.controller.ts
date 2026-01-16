import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import logger from '../../../common/utils/logger';
import {
  loginService,
  signupService,
  refreshTokenService,
  logoutService,
  logoutAllService,
  getActiveSessionsService,
  getLoginContext,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
} from '../services/Auth.service';
import { STATUS, STATUS_CODE } from '../../../common/constants/constants';
import { LoginData, SignupData } from '../types/types';
import { IRequest } from '../../../common/interfaces/types';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';

export const signup = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const data: SignupData = req.body as SignupData;
  const analyst = await signupService(data);

  logger.info('Analyst signed up successfully', { email: analyst.email });

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    data: analyst,
  });
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const data: LoginData = req.body as LoginData;
  const context = getLoginContext(req);
  const { analyst, accessToken, refreshToken } = await loginService(data, context);

  logger.info('Analyst logged in successfully', { email: analyst.email });

  setRefreshTokenCookie(res, refreshToken);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: analyst,
    token: accessToken,
  });
});

export const refresh = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiErrorHandler(STATUS_CODE.BAD_REQUEST, 'Refresh token is required');
  }

  const context = getLoginContext(req);
  const { accessToken, refreshToken: newRefreshToken } = await refreshTokenService(
    refreshToken,
    context,
  );

  logger.info('Token refreshed successfully');

  setRefreshTokenCookie(res, newRefreshToken);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    token: accessToken,
  });
});

export const logout = catchAsync(async (req: IRequest, res: Response): Promise<void> => {
  const accessToken = req.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (accessToken) {
    await logoutService(accessToken, refreshToken);
    logger.info('Analyst logged out successfully', { userId: req.user?.id });
  }

  clearRefreshTokenCookie(res);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    message: 'Logged out successfully',
  });
});

export const logoutAll = catchAsync(async (req: IRequest, res: Response): Promise<void> => {
  await logoutAllService(req.user!.id, req.accessToken!);

  logger.info('All sessions logged out for analyst', { userId: req.user!.id });

  clearRefreshTokenCookie(res);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    message: 'All sessions have been terminated',
  });
});

export const getActiveSessions = catchAsync(async (req: IRequest, res: Response): Promise<void> => {
  const sessions = await getActiveSessionsService(req.user!.id);

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: sessions,
  });
});
