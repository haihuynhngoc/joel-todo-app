import { Pool } from 'pg';

export const sampleTodos = {
  buyGroceries: {
    text: 'Buy groceries',
    completed: false,
  },
  writeTests: {
    text: 'Write unit tests',
    completed: true,
  },
  readBook: {
    text: 'Read a book',
    completed: false,
  },
  longText: {
    text: 'This is a very long todo item text that contains many words and should be handled properly by the application without any issues even though it is quite lengthy',
    completed: false,
  },
};

export async function createTodo(
  pool: Pool,
  data: { text: string; completed?: boolean }
): Promise<{ id: number; text: string; completed: boolean; created_at: Date }> {
  const { text, completed = false } = data;

  const result = await pool.query(
    'INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING *',
    [text, completed]
  );

  return result.rows[0];
}

export async function createMultipleTodos(
  pool: Pool,
  count: number
): Promise<Array<{ id: number; text: string; completed: boolean; created_at: Date }>> {
  const todos = [];

  for (let i = 1; i <= count; i++) {
    const todo = await createTodo(pool, {
      text: `Todo ${i}`,
      completed: i % 2 === 0,
    });
    todos.push(todo);
  }

  return todos;
}

export async function getAllTodos(pool: Pool): Promise<
  Array<{ id: number; text: string; completed: boolean; created_at: Date }>
> {
  const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
  return result.rows;
}

export async function getTodoById(
  pool: Pool,
  id: number
): Promise<{ id: number; text: string; completed: boolean; created_at: Date } | null> {
  const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
  return result.rows[0] || null;
}
