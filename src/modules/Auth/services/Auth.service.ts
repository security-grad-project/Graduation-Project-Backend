import { LoginData, SignupData, AnalystResponse } from '../types/types';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { prisma } from '../../../config/postgres';
import { hashPassword, comparePassword } from '../../../common/utils/primsa-util';
import { generateToken, generateRefreshToken } from '../../../common/utils/jwtTokens';
import { STATUS_CODE } from '../../../common/constants/constants';

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

  const accessToken = generateToken(analyst.id, { role: analyst.role });
  const refreshToken = generateRefreshToken(analyst.id, { role: analyst.role });

  return { analyst: sanitizeAnalyst(updatedAnalyst), accessToken, refreshToken };
};
