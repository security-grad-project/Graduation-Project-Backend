import 'dotenv/config';
import { testPostgresConnection } from './config/postgres';
import { mongoConnection } from './config/mongodb';
import app from './app';

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await testPostgresConnection();
    await mongoConnection();
    app.listen(PORT, async () => {
      console.log('Server is running on port 4000');
    });
  } catch (err) {
    console.error('Failed to startup:', err);
    process.exit(0);
  }
};

startServer();
