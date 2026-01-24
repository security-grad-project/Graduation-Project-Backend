import { Client } from '@elastic/elasticsearch';
import env from './env';
import logger from '../common/utils/logger';

export const elasticClient = new Client({
  node: env.ELASTICSEARCH_URL,
  auth: {
    username: env.ELASTICSEARCH_USERNAME,
    password: env.ELASTICSEARCH_PASSWORD,
  },
  tls: {
    rejectUnauthorized: env.NODE_ENV === 'production',
  },
  maxRetries: 3,
  requestTimeout: 30000,
});

export const testElasticConnection = async (retries = 3, delay = 2000): Promise<void> => {
  // for (let attempt = 1; attempt <= retries; attempt++) {
  //   try {
  //     const health = await elasticClient.cluster.health({});
  //     logger.info(`Elasticsearch connected. Status: ${health.status}`);
  //     return;
  //   } catch (error) {
  //     if (attempt === retries) {
  //       logger.error(`Elasticsearch failed after ${retries} attempts`, { error });
  //       throw error;
  //     }
  //     logger.warn(`Elasticsearch attempt ${attempt}/${retries} failed, retrying...`);
  //     await new Promise((r) => setTimeout(r, delay));
  //   }
  // }
};
