import winston from 'winston';
import path from 'path';

const { combine, timestamp, json } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({ filename: path.join('./logs', 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join('./logs', 'app.log') }),
    new winston.transports.Console(),
  ],
});

export default logger;
