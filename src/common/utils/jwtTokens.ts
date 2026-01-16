import jwt from 'jsonwebtoken';
import config from '../../config/env';
import { ITokenPayload } from '../interfaces/types';

export const generateToken = (id: string, additionalPayload: object = {}): string => {
  const payload = { id, ...additionalPayload };

  return jwt.sign(payload, config.JWT_ACCESS_KEY, {
    expiresIn: config.ACCESS_TOKEN_EXPIRED_IN,
  });
};

export const verifyToken = (token: string): Promise<ITokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_ACCESS_KEY, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded as ITokenPayload);
    });
  });
};

export const generateRefreshToken = (id: string, additionalPayload: object = {}): string => {
  const payload = { id, ...additionalPayload };

  return jwt.sign(payload, config.JWT_REFRESH_KEY, {
    expiresIn: config.REFRESH_TOKEN_EXPIRED_IN,
  });
};

export const verifyRefreshToken = (token: string): Promise<ITokenPayload> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.JWT_REFRESH_KEY, (err, decoded) => {
      if (err) reject(err);
      resolve(decoded as ITokenPayload);
    });
  });
};
