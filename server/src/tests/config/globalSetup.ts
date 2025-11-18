import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Pool } from 'pg';

declare global {
  // eslint-disable-next-line no-var
  var __TESTCONTAINER__: StartedPostgreSqlContainer;
}

export default async function globalSetup() {
  console.log('🐳 Starting PostgreSQL test container...');

  const container = await new PostgreSqlContainer('postgres:14-alpine')
    .withDatabase('todo_app_test')
    .withUsername('test_user')
    .withPassword('test_password')
    .start();

  global.__TESTCONTAINER__ = container;

  const connectionUri = container.getConnectionUri();
  process.env.DATABASE_URL = connectionUri;

  console.log('✓ PostgreSQL container started');
  console.log(`✓ Database URL: ${connectionUri}`);

  const pool = new Pool({ connectionString: connectionUri });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        text VARCHAR(500) NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC)`);

    console.log('✓ Test database tables created');
  } finally {
    await pool.end();
  }
}
