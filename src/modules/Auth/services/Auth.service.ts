import { SignupData } from '../types/types';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { prisma } from '../../../config/postgres';
import bcrypt from 'bcrypt';

export const signupService = async (data: SignupData) => {
  const { email, password, firstName, lastName, phoneNumber } = data;

  if (!email || !password || !firstName || !lastName || !phoneNumber)
    throw new ApiErrorHandler(400, 'some required values not exist');

  const hashedPassword = await bcrypt.hash(password, 12);

  const analyst = await prisma.analyst.create({
    data: {
      email: email,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      role: 'SOC_ADMIN',
      lastLogin: new Date(),
    },
  });

  if (!analyst) throw new ApiErrorHandler(400, 'something went wrong while signning up');

  return analyst;
};
