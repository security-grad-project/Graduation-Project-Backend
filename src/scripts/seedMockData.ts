import fs from 'fs';
import path from 'path';
import { prisma } from '../config/postgres';
import { elasticClient } from '../config/elasticsearch';
import logger from '../common/utils/logger';

const SEED_FILE = path.join(__dirname, 'mockData.json');

async function seed() {
  try {
    if (!fs.existsSync(SEED_FILE)) {
      throw new Error(`Mock data file not found at ${SEED_FILE}`);
    }

    const rawData = fs.readFileSync(SEED_FILE, 'utf-8');
    const { logSources, events } = JSON.parse(rawData);

    logger.info('Starting database and Elasticsearch seeding...');

    // 1. Seed Log Sources to PostgreSQL via Prisma
    const sourceMap = new Map<string, string>();
    for (const source of logSources) {
      await prisma.logSource.upsert({
        where: { id: source.id },
        update: {
          name: source.name,
          category: source.category,
          vendor: source.vendor,
          product: source.product,
          description: source.description,
          dataset: source.dataset,
          type: source.type,
          index: source.index,
          agent: source.agent,
          agentVersion: source.agentVersion,
          pipeline: source.pipeline,
          format: source.format,
          retentionDays: source.retentionDays,
          ilmPolicy: source.ilmPolicy,
          shards: source.shards,
          owner: source.owner,
          enabled: source.enabled,
          tags: source.tags,
          createdAt: new Date(source.createdAt),
          updatedAt: new Date(source.updatedAt),
        },
        create: {
          id: source.id,
          name: source.name,
          category: source.category,
          vendor: source.vendor,
          product: source.product,
          description: source.description,
          dataset: source.dataset,
          type: source.type,
          index: source.index,
          agent: source.agent,
          agentVersion: source.agentVersion,
          pipeline: source.pipeline,
          format: source.format,
          retentionDays: source.retentionDays,
          ilmPolicy: source.ilmPolicy,
          shards: source.shards,
          owner: source.owner,
          enabled: source.enabled,
          tags: source.tags,
          createdAt: new Date(source.createdAt),
          updatedAt: new Date(source.updatedAt),
        },
      });
      sourceMap.set(source.id, source.index);
      logger.info(`LogSource upserted in PostgreSQL: ${source.name} (Index: ${source.index})`);
    }

    // 2. Seed Log Events to Elasticsearch
    for (const event of events) {
      const indexName = sourceMap.get(event.logSourceId);
      if (!indexName) {
        logger.warn(`Event ${event.id} refers to unknown logSourceId ${event.logSourceId}. Skipping.`);
        continue;
      }

      try {
        await elasticClient.index({
          index: indexName,
          id: event.id,
          op_type: 'create',
          document: {
            ...event,
            '@timestamp': event['@timestamp'] || new Date().toISOString(),
          },
        });
        logger.info(`Event indexed in Elasticsearch under [${indexName}]: ID ${event.id}`);
      } catch (err: any) {
        if (err.statusCode === 409) {
          logger.warn(`Event ${event.id} already exists in [${indexName}]. Skipping.`);
        } else {
          throw err;
        }
      }
    }

    // Force flush Elasticsearch so indexed documents are immediately searchable
    await elasticClient.indices.refresh({ index: '_all' });
    logger.info('Elasticsearch indexes refreshed.');

    logger.info('Seeding completed successfully!');
  } catch (error) {
    logger.error('Seeding failed:', { error });
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
