import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fs from 'fs';
import morgan from 'morgan';
import path from 'path';
import errorHandler from './common/errors/errorHandler';

const app = express();

const logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'api.log'), {
  flags: 'a',
});

app.use(cors());
app.use(helmet());
app.use(morgan('tiny', { stream: logStream }));

app.get('/', async (req, res) => {
  res.send('Hello');
});

app.use(errorHandler);

export default app;
