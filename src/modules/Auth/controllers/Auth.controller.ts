import { Request, Response } from 'express';
import catchAsync from '../../../common/utils/catchAsync';
import logger from '../../../common/utils/logger';
import { loginService, signupService } from '../services/Auth.service';
import { STATUS, STATUS_CODE } from '../../../common/constants/constants';
import { LoginData, SignupData } from '../types/types';

export const signup = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const data: SignupData = req.body as SignupData;
  const analyst = await signupService(data);

  logger.info('analyst signned up successfully', { Email: analyst.email });

  res.status(STATUS_CODE.CREATED).json({
    status: STATUS.SUCCESS,
    data: analyst,
  });
});

export const login = catchAsync(async (req: Request, res: Response): Promise<void> => {
  const data: LoginData = req.body as LoginData;
  const { analyst, accessToken } = await loginService(data);

  logger.info('analyst logged in successfully', { Email: analyst.email });

  res.status(STATUS_CODE.SUCCESS).json({
    status: STATUS.SUCCESS,
    data: analyst,
    accessToken,
  });
});
