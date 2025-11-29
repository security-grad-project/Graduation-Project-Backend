import mongoose from 'mongoose';
import env from './env';

export const mongoConnection = async () => {
  try {
    await mongoose.connect(env.MONGODB_URL!);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB failed to connect: ', err);
    throw err;
  }
};
