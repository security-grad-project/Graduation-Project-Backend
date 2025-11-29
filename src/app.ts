import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import errorHandler from './common/errors/errorHandler';
import { morganMiddleware } from './common/middlewares/middleware';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morganMiddleware);

app.get('/', async (req, res) => {
  res.send('Hello');
});

app.use(errorHandler);

export default app;
