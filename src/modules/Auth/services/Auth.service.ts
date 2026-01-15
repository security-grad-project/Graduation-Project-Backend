import { LoginData, SignupData } from '../types/types';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { prisma } from '../../../config/postgres';
import { hashPassword, comparePassword } from '../../../common/utils/primsa-util';
import { generateToken } from '../../../common/utils/jwtTokens';

export const signupService = async (data: SignupData) => {
  const { email, password, firstName, lastName, phoneNumber } = data;

  if (!email || !password || !firstName || !lastName || !phoneNumber)
    throw new ApiErrorHandler(400, 'some required values not exist');

  const hashedPassword = await hashPassword(password);

  const analyst = await prisma.analyst.create({
    data: {
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    },
  });

  if (!analyst) throw new ApiErrorHandler(500, 'something went wrong while signning up');

  return analyst;
};

export const loginService = async (data: LoginData) => {
  const { email, password } = data;
  if (!email || !password) throw new ApiErrorHandler(400, 'some required values not exist');

  const analyst = await prisma.analyst.findUnique({ where: { email: email } });
  if (!analyst) throw new ApiErrorHandler(404, 'analyst not found');

  const isPasswordMatched = await comparePassword(password, analyst.password);
  if (!isPasswordMatched) throw new ApiErrorHandler(401, 'invalid credentials');

  await prisma.analyst.update({
    where: { id: analyst.id },
    data: { lastLogin: new Date() },
  });

  const accessToken = generateToken(analyst.id, { role: analyst.role });

  return { analyst, accessToken };
};
