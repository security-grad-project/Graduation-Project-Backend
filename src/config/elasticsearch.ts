import { Client } from '@elastic/elasticsearch';
import env from './env';
import logger from '../common/utils/logger';

export const elasticClient = new Client({
  node: env.ELASTICSEARCH_URL,
  auth: {
    username: env.ELASTICSEARCH_USERNAME || 'elastic',
    password: env.ELASTICSEARCH_PASSWORD || '',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const testElasticConnection = async () => {
  try {
    const health = await elasticClient.cluster.health({});
    logger.info(`Elasticsearch connected. Status: ${health.status}`);
  } catch (error) {
    logger.error('Elasticsearch connection failed', { error });
    throw error;
  }
};
