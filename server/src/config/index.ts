import dotenv from 'dotenv';
import path from 'path';

if (process.env.NODE_ENV !== 'test' || !process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

interface Config {
  database: {
    url: string;
  };
  server: {
    port: number;
    nodeEnv: string;
  };
}

const config: Config = {
  database: {
    url: process.env.DATABASE_URL || '',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
};

if (!config.database.url) {
  throw new Error('DATABASE_URL environment variable is required');
}

export default config;
