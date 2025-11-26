import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ApiErrorHandler from './common/utils/ApiErrorHandler';
import errorHandler from './common/errors/errorHandler';
import { HTTP_STATUS } from './common/constants/responceCode';
const app = express();

app.use(cors());
app.use(helmet());

// Force an uncaught exception
setTimeout(() => {
  throw new Error('This is an uncaught exception test!');
}, 1000);

app.get('/', async (req, res, next) => {
  return next(new ApiErrorHandler(HTTP_STATUS.BAD_REQUEST, 'Test Error'));
});

app.use(errorHandler);

export default app;
