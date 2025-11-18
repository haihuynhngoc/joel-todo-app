import fs from 'fs';
import path from 'path';
import pool from './connection';

async function runMigrations() {
  console.log('Starting database migrations...');

  try {
    const migrationPath = path.join(__dirname, 'migrations', '001_create_todos_table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    await pool.query(migrationSQL);

    console.log('✓ Migration 001_create_todos_table.sql executed successfully');
    console.log('✓ Database migrations completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
