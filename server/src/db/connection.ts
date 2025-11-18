import { Pool } from 'pg';
import config from '../config';

const pool = new Pool({
  connectionString: config.database.url,
});

pool.on('error', (err) => {
  if (process.env.NODE_ENV === 'test' && err.message?.includes('terminating connection')) {
    return;
  }
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
