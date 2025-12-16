import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../common/utils/catchAsync';
import { prisma } from '../../config/postgres';
import ApiErrorHandler from '../../common/utils/ApiErrorHandler';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../../common/functions/generateTokens';
import config from '../../config/env';

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // TODO: Remove this to
    const analysts = await prisma.analyst.count();
    if (analysts !== 0) return next(new ApiErrorHandler(403, 'Signup is disabled. Please login.'));

    const { email, password, firstName, lastName, phoneNumber } = req.body;
    const role = 'SOC_ADMIN';
    const hashedPassword = await bcrypt.hash(password, 12);

    const analyst = await prisma.analyst.create({
      data: {
        email: email,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        role: role,
        lastLogin: new Date(),
      },
    });

    if (!analyst) return next(new ApiErrorHandler(400, 'something went wrong while signning up'));
    // TODO : Remove token generation
    const refreshToken = generateRefreshToken(analyst.id);
    const accessToken = generateAccessToken(analyst.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: config.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      status: 'success',
      data: analyst,
      accessToken,
    });
  },
);
