import { SignupData } from '../types/types';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { prisma } from '../../../config/postgres';
import { hashPassword } from '../../../common/utils/primsa-util';

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
