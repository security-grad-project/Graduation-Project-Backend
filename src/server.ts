import 'dotenv/config';
import { prisma, testPostgresConnection } from './config/postgres';
import app from './app';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await testPostgresConnection();
    app.listen(PORT, async () => {
      console.log('Server is running on port 4000');
    });
  } catch (err) {
    console.error('Failed to startup:');
    process.exit(0);
  }
};

startServer();
