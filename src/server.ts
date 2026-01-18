import 'dotenv/config';
import http from 'http';
import { testPostgresConnection, prisma } from './config/postgres';
import { mongoConnection } from './config/mongodb';
import { elasticClient, testElasticConnection } from './config/elasticsearch';
import app from './app';
import env from './config/env';
import logger from './common/utils/logger';
import { startTokenCleanupJob, stopTokenCleanupJob } from './jobs/token-cleanup.job';

const PORT = env.PORT;
let server: http.Server | null = null;

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', { error: err });
  process.exit(1);
});

const startServer = async () => {
  try {
    await testPostgresConnection();
    await mongoConnection();
    await testElasticConnection();

    // Start token cleanup job
    startTokenCleanupJob();

    server = app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });

    process.on('unhandledRejection', (err: unknown) => {
      logger.error('UNHANDLED REJECTION! Shutting down...', { error: err });
      if (server) {
        server.close(async () => {
          stopTokenCleanupJob();
          await prisma.$disconnect().catch(() => undefined);
          await elasticClient.close().catch(() => undefined);
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    const gracefulShutdown = (signal: string) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      if (server) {
        server.close(async () => {
          stopTokenCleanupJob();
          await prisma.$disconnect().catch(() => undefined);
          await elasticClient.close().catch(() => undefined);
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  } catch (err) {
    logger.error('Failed to startup', { error: err });
    process.exit(1);
  }
};

startServer();
