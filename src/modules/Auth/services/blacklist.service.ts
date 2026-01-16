import { prisma } from '../../../config/postgres';
import { getTokenExpiryDate } from './token.service';

export const blacklistAccessToken = async (token: string): Promise<void> => {
  const expiresAt = getTokenExpiryDate(token);

  const defaultExpiry = new Date(Date.now() + 60 * 60 * 1000);
  const finalExpiry = expiresAt || defaultExpiry;

  if (finalExpiry > new Date()) {
    await prisma.accessTokenBlacklist.upsert({
      where: { token },
      update: {},
      create: {
        token,
        expiresAt: finalExpiry,
      },
    });
  }
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const blacklistedToken = await prisma.accessTokenBlacklist.findUnique({
    where: { token },
  });

  return !!blacklistedToken;
};

export const cleanupExpiredBlacklistedTokens = async (): Promise<number> => {
  const result = await prisma.accessTokenBlacklist.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });

  return result.count;
};
