import pool from '../db/connection';
import { Todo } from '../models/todo';

export async function findAll(): Promise<Todo[]> {
  try {
    const result = await pool.query<Todo>(
      'SELECT id, text, completed, created_at, updated_at FROM todos ORDER BY created_at DESC'
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to fetch todos: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function create(text: string): Promise<Todo> {
  try {
    const result = await pool.query<Todo>(
      `INSERT INTO todos (text, completed, created_at, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING id, text, completed, created_at, updated_at`,
      [text, false]
    );

    if (result.rows.length === 0) {
      throw new Error('Failed to create todo: No row returned');
    }

    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to create todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function findById(id: number): Promise<Todo | null> {
  try {
    const result = await pool.query<Todo>(
      'SELECT id, text, completed, created_at, updated_at FROM todos WHERE id = $1',
      [id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new Error(`Failed to find todo by id: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function updateCompleted(id: number, completed: boolean): Promise<Todo | null> {
  try {
    const result = await pool.query<Todo>(
      `UPDATE todos
       SET completed = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, text, completed, created_at, updated_at`,
      [completed, id]
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new Error(`Failed to update todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteById(id: number): Promise<boolean> {
  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);

    return (result.rowCount ?? 0) > 0;
  } catch (error) {
    throw new Error(`Failed to delete todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
