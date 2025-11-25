import express from 'express';
import { prisma } from './config/postgres';

const app = express();

app.get('/', async (req, res) => {
  res.json({
    users: await prisma.user.findMany(),
  });
});

export default app;
