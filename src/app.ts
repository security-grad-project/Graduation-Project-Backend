import express from 'express';
import { prisma } from './config/postgres';
import mongoose from 'mongoose';
import { Blog } from './test_mongo/model';

const app = express();

app.get('/', async (req, res) => {
  const data = await Blog.find();
  console.log(data);
  res.json({
    data,
  });
});

export default app;
