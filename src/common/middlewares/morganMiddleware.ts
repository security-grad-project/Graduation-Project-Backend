import morgan from 'morgan';
import logger from '../utils/logger';

const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export const morganMiddleware = morgan(
  (tokens, req, res) => {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      responseTime: `${tokens['response-time'](req, res)}ms`,
      userAgent: tokens['user-agent'](req, res),
    });
  },
  { stream },
);
