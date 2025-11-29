import 'dotenv/config';
import { testPostgresConnection } from './config/postgres';
import { mongoConnection } from './config/mongodb';
import app from './app';

const PORT = process.env.PORT || 3000;

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    await testPostgresConnection();
    await mongoConnection();

    const server = app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
    });

    process.on('unhandledRejection', (err: any) => {
      console.log('UNHANDLED REJECTION!  Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.error('Failed to startup:', err);
    process.exit(1);
  }
};

startServer();
