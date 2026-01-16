import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import logger from '../../../common/utils/logger';
import { loginService, signupService } from '../services/Auth.service';
import { STATUS, STATUS_CODE } from '../../../common/constants/constants';
import { LoginData, SignupData } from '../types/types';
import config from '../../../config/env';
import ms from 'ms';

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
  const { analyst, accessToken, refreshToken } = await loginService(data);

  logger.info('Analyst logged in successfully', { email: analyst.email });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: ms(config.REFRESH_TOKEN_EXPIRED_IN),
  });

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: analyst,
    token: accessToken,
  });
});
