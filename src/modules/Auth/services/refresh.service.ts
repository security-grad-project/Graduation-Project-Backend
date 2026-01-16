import ms from 'ms';
import { prisma } from '../../../config/postgres';
import config from '../../../config/env';
import { generateSecureToken, hashToken } from './token.service';
import ApiErrorHandler from '../../../common/utils/ApiErrorHandler';
import { STATUS_CODE } from '../../../common/constants/constants';

interface CreateRefreshTokenInput {
  analystId: string;
  userAgent?: string;
  ipAddress?: string;
}

interface RefreshTokenData {
  token: string;
  hashedToken: string;
  expiresAt: Date;
}

export const createRefreshToken = async (
  input: CreateRefreshTokenInput,
): Promise<RefreshTokenData> => {
  const { analystId, userAgent, ipAddress } = input;

  const token = generateSecureToken();
  const hashedToken = hashToken(token);

  const expiresIn = ms(config.REFRESH_TOKEN_EXPIRED_IN);
  const expiresAt = new Date(Date.now() + expiresIn);

  await prisma.refreshToken.create({
    data: {
      token: hashedToken,
      analystId,
      expiresAt,
      userAgent,
      ipAddress,
    },
  });

  return { token, hashedToken, expiresAt };
};

export const validateRefreshToken = async (token: string) => {
  const hashedToken = hashToken(token);

  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token: hashedToken },
    include: { analyst: true },
  });

  if (!refreshToken) {
    throw new ApiErrorHandler(STATUS_CODE.UNAUTHORIZED, 'Invalid refresh token');
  }

  if (refreshToken.revoked) {
    await revokeAllAnalystTokens(refreshToken.analystId);
    throw new ApiErrorHandler(
      STATUS_CODE.UNAUTHORIZED,
      'Refresh token has been revoked. All sessions have been terminated for security.',
    );
  }

  if (refreshToken.expiresAt < new Date()) {
    throw new ApiErrorHandler(STATUS_CODE.UNAUTHORIZED, 'Refresh token has expired');
  }

  return refreshToken;
};

export const revokeRefreshToken = async (token: string): Promise<void> => {
  const hashedToken = hashToken(token);

  await prisma.refreshToken.updateMany({
    where: { token: hashedToken },
    data: {
      revoked: true,
      revokedAt: new Date(),
    },
  });
};

export const revokeRefreshTokenByHash = async (hashedToken: string): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: { token: hashedToken },
    data: {
      revoked: true,
      revokedAt: new Date(),
    },
  });
};

export const revokeAllAnalystTokens = async (analystId: string): Promise<void> => {
  await prisma.refreshToken.updateMany({
    where: {
      analystId,
      revoked: false,
    },
    data: {
      revoked: true,
      revokedAt: new Date(),
    },
  });
};

export const getActiveSessions = async (analystId: string) => {
  return prisma.refreshToken.findMany({
    where: {
      analystId,
      revoked: false,
      expiresAt: { gt: new Date() },
    },
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const rotateRefreshToken = async (
  oldToken: string,
  analystId: string,
  userAgent?: string,
  ipAddress?: string,
): Promise<RefreshTokenData> => {
  await revokeRefreshToken(oldToken);

  return createRefreshToken({ analystId, userAgent, ipAddress });
};

export const cleanupExpiredTokens = async (): Promise<number> => {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      OR: [{ expiresAt: { lt: new Date() } }, { revoked: true, revokedAt: { lt: new Date() } }],
    },
  });

  return result.count;
};
