import 'dotenv/config';
import env from 'env-var';
import ms from 'ms';

export default {
  NODE_ENV: env
    .get('NODE_ENV')
    .default('development')
    .asEnum(['development', 'production', 'test']),
  PORT: env.get('PORT').default('3000').asPortNumber(),

  DATABASE_URL: env.get('DATABASE_URL').required().asString(),
  MONGODB_URL: env.get('MONGODB_URL').required().asString(),

  JWT_REFRESH_KEY: env.get('JWT_REFRESH_KEY').required().asString(),
  JWT_ACCESS_KEY: env.get('JWT_ACCESS_KEY').required().asString(),
  REFRESH_TOKEN_EXPIRED_IN: env
    .get('REFRESH_TOKEN_EXPIRED_IN')
    .default('7d')
    .asString() as ms.StringValue,
  ACCESS_TOKEN_EXPIRED_IN: env
    .get('ACCESS_TOKEN_EXPIRED_IN')
    .default('1h')
    .asString() as ms.StringValue,

  FRONTEND_URL: env.get('FRONTEND_URL').asString(),

  ELASTICSEARCH_URL: env.get('ELASTICSEARCH_URL').default('http://localhost:9200').asUrlString(),
  ELASTICSEARCH_USERNAME: env.get('ELASTICSEARCH_USERNAME').default('elastic').asString(),
  ELASTICSEARCH_PASSWORD: env.get('ELASTICSEARCH_PASSWORD').default('').asString(),
};
