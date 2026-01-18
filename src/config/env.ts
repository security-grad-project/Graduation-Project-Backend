import 'dotenv/config';
import ms from 'ms';

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY!,
  JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY!,
  REFRESH_TOKEN_EXPIRED_IN: (process.env.REFRESH_TOKEN_EXPIRED_IN as ms.StringValue) || '7d',
  ACCESS_TOKEN_EXPIRED_IN: (process.env.ACCESS_TOKEN_EXPIRED_IN as ms.StringValue) || '1h',
  FRONTEND_URL: process.env.FRONTEND_URL,
  ELASTICSEARCH_URL: process.env.ELASTICSEARCH_URL,
  ELASTICSEARCH_USERNAME: process.env.ELASTICSEARCH_USERNAME,
  ELASTICSEARCH_PASSWORD: process.env.ELASTICSEARCH_PASSWORD,
};
