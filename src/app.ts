import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import mongoSanitize from 'express-mongo-sanitize';
import errorHandler from './common/errors/errorHandler';
import limiter from './config/limiter';

const app = express();

const logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'api.log'), {
  flags: 'a',
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('tiny', { stream: logStream }));
app.use(mongoSanitize());
app.use(limiter);

app.get('/', async (req, res) => {
  res.send('Hello');
});

app.use(errorHandler);

export default app;
