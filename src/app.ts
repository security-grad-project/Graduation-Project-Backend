import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ApiErrorHandler from './common/utils/ApiErrorHandler';
import errorHandler from './common/errors/errorHandler';
import { HTTP_STATUS } from './common/constants/responceCode';
import { morganMiddleware } from './common/middlewares/middleware';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morganMiddleware);

app.get('/', async (req, res, next) => {
  // res.send('Hello');
  return next(new ApiErrorHandler(HTTP_STATUS.BAD_REQUEST, 'Test Error'));
});

app.use(errorHandler);

export default app;
