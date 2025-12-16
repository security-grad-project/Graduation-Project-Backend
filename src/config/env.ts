import 'dotenv/config';
import ms from 'ms';

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_REFRESH_KEY: process.env.JWT_REFRESH_KEY!,
  JWT_ACCESS_KEY: process.env.JWT_ACCESS_KEY!,
  JWT_REFRESH_EXPIRED_IN: process.env.JWT_REFRESH_EXPIRED_IN as ms.StringValue,
  JWT_ACCESS_EXPIRED_IN: process.env.JWT_ACCESS_EXPIRED_IN as ms.StringValue,
};
