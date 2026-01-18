import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.config';
import errorHandler from './common/errors/errorHandler';
import { notFound } from './common/middlewares/index';
import limiter from './config/limiter';
import env from './config/env';
import router from './routes/index';
import { elasticClient } from './config/elasticsearch';

const app = express();

const logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'api.log'), {
  flags: 'a',
});

app.use(helmet());
app.use(cookieParser());

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: env.NODE_ENV === 'production' ? env.FRONTEND_URL : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('tiny', { stream: logStream }));
}
app.use(limiter);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Root endpoint
 *     description: Simple hello world endpoint
 *     responses:
 *       200:
 *         description: Hello World message
 */
app.get('/', (req, res) => {
  res.send('Hello World');
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check the health and uptime of the server
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                   example: 1234.56
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-15T20:00:00.000Z
 */
app.get('/health', async (req, res) => {
  const elasticStatus = await elasticClient.ping().catch(() => false);

  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    elasticsearch: elasticStatus ? 'connected' : 'disconnected',
  });
});

// Swagger Documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Documentation',
  }),
);

app.use('/api/v1', router);

app.all(/(.*)/, notFound);
app.use(errorHandler);

export default app;
