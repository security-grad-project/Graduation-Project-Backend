import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import ApiErrorHandler from './common/utils/ApiErrorHandler';
import errorHandler from './common/errors/errorHandler';
import { HTTP_STATUS } from './common/constants/responceCode';
const app = express();

app.use(cors());
app.use(helmet());

app.get('/', async (req, res, next) => {
  return next(new ApiErrorHandler(HTTP_STATUS.BAD_REQUEST, 'Test Error'));
});

app.use(errorHandler);

export default app;
