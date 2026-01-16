import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '../../../config/env';
import { ITokenPayload } from '../../../common/interfaces/types';

export const generateSecureToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const generateAccessToken = (id: string, additionalPayload: object = {}): string => {
  const payload = { id, ...additionalPayload };

  return jwt.sign(payload, config.JWT_ACCESS_KEY, {
    expiresIn: config.ACCESS_TOKEN_EXPIRED_IN,
  });
};

export const verifyAccessToken = (token: string): Promise<ITokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_ACCESS_KEY, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as ITokenPayload);
    });
  });
};

export const generateJwtRefreshToken = (id: string, additionalPayload: object = {}): string => {
  const payload = { id, ...additionalPayload };

  return jwt.sign(payload, config.JWT_REFRESH_KEY, {
    expiresIn: config.REFRESH_TOKEN_EXPIRED_IN,
  });
};

export const verifyJwtRefreshToken = (token: string): Promise<ITokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_REFRESH_KEY, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as ITokenPayload);
    });
  });
};

export const decodeToken = (token: string): ITokenPayload | null => {
  const decoded = jwt.decode(token);
  return decoded as ITokenPayload | null;
};

export const getTokenExpiryDate = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  return new Date(decoded.exp * 1000);
};
