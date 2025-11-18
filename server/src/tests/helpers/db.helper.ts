import { Pool } from 'pg';

export function createTestPool(): Pool {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  return new Pool({
    connectionString: databaseUrl,
  });
}

export async function clearTodosTable(pool: Pool): Promise<void> {
  await pool.query('DELETE FROM todos');
  await pool.query('ALTER SEQUENCE todos_id_seq RESTART WITH 1');
}

export async function createTodosTable(pool: Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text VARCHAR(500) NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  try {
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed)`);
    await pool.query(
      `CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC)`
    );
  } catch {
  }
}

export async function dropTodosTable(pool: Pool): Promise<void> {
  await pool.query('DROP TABLE IF EXISTS todos');
}

export async function closePool(pool: Pool): Promise<void> {
  await pool.end();
}
