import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import mongoSanitize from 'express-mongo-sanitize';
import errorHandler from './common/errors/errorHandler';
import { notFound } from './common/middlewares/index';
import limiter from './config/limiter';
import env from './config/env';

const app = express();

const logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'api.log'), {
  flags: 'a',
});

app.use(helmet());

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('tiny', { stream: logStream }));
}
app.use(limiter);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.all(/(.*)/, notFound);
app.use(errorHandler);

export default app;
