import morgan from 'morgan';
import logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

const logStream = fs.createWriteStream(path.join(process.cwd(), 'logs', 'api.log'), {
  flags: 'a',
});

export const morganMiddleware = morgan('tiny', { stream: logStream });
