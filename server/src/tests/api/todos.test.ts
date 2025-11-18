import request from 'supertest';
import { Pool } from 'pg';
import { Express } from 'express';
import {
  createTestApp,
  createTestPool,
  clearTodosTable,
  createTodosTable,
  createTodo,
  createMultipleTodos,
  sampleTodos,
  closePool,
} from '../helpers';

describe('Todo API Endpoints', () => {
  let pool: Pool;
  let app: Express;

  beforeAll(async () => {
    pool = createTestPool();
    app = createTestApp();

    await createTodosTable(pool);
  });

  beforeEach(async () => {
    await clearTodosTable(pool);
  });

  afterAll(async () => {
    await closePool(pool);
  });

  describe('GET /todos', () => {
    it('should return an empty array when no todos exist', async () => {
      const response = await request(app).get('/todos');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should return all todos', async () => {
      // Create sample todos
      await createTodo(pool, sampleTodos.buyGroceries);
      await createTodo(pool, sampleTodos.writeTests);

      const response = await request(app).get('/todos');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({
        id: expect.any(Number),
        text: expect.any(String),
        completed: expect.any(Boolean),
        created_at: expect.any(String),
      });
    });

    it('should return todos in descending order by creation date (newest first)', async () => {
      const todo1 = await createTodo(pool, { text: 'First todo' });
      const todo2 = await createTodo(pool, { text: 'Second todo' });
      const todo3 = await createTodo(pool, { text: 'Third todo' });

      const response = await request(app).get('/todos');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body[0].id).toBe(todo3.id);
      expect(response.body[1].id).toBe(todo2.id);
      expect(response.body[2].id).toBe(todo1.id);
    });

    it('should handle large number of todos', async () => {
      await createMultipleTodos(pool, 100);

      const response = await request(app).get('/todos');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(100);
    });
  });

  describe('POST /todos', () => {
    it('should create a new todo with valid data', async () => {
      const todoData = { text: 'New todo item' };

      const response = await request(app).post('/todos').send(todoData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        text: 'New todo item',
        completed: false,
        created_at: expect.any(String),
      });
    });

    it('should create multiple todos successfully', async () => {
      const todo1 = await request(app).post('/todos').send({ text: 'First' });
      const todo2 = await request(app).post('/todos').send({ text: 'Second' });

      expect(todo1.status).toBe(201);
      expect(todo2.status).toBe(201);
      expect(todo1.body.id).not.toBe(todo2.body.id);
    });

    it('should handle long text (up to 500 characters)', async () => {
      const longText = 'a'.repeat(500);
      const response = await request(app).post('/todos').send({ text: longText });

      expect(response.status).toBe(201);
      expect(response.body.text).toBe(longText);
    });

    it('should return 400 when text is missing', async () => {
      const response = await request(app).post('/todos').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when text is empty string', async () => {
      const response = await request(app).post('/todos').send({ text: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when text is only whitespace', async () => {
      const response = await request(app).post('/todos').send({ text: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when text exceeds 500 characters', async () => {
      const tooLongText = 'a'.repeat(501);
      const response = await request(app).post('/todos').send({ text: tooLongText });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when text is not a string', async () => {
      const response = await request(app).post('/todos').send({ text: 123 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update todo completion status to true', async () => {
      const todo = await createTodo(pool, { text: 'Test todo', completed: false });

      const response = await request(app).put(`/todos/${todo.id}`).send({ completed: true });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: todo.id,
        text: 'Test todo',
        completed: true,
      });
    });

    it('should update todo completion status to false', async () => {
      const todo = await createTodo(pool, { text: 'Test todo', completed: true });

      const response = await request(app).put(`/todos/${todo.id}`).send({ completed: false });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        id: todo.id,
        completed: false,
      });
    });

    it('should return 404 when todo does not exist', async () => {
      const response = await request(app).put('/todos/99999').send({ completed: true });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when completed field is missing', async () => {
      const todo = await createTodo(pool, sampleTodos.buyGroceries);

      const response = await request(app).put(`/todos/${todo.id}`).send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when completed is not a boolean', async () => {
      const todo = await createTodo(pool, sampleTodos.buyGroceries);

      const response = await request(app).put(`/todos/${todo.id}`).send({ completed: 'yes' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when id is not a valid number', async () => {
      const response = await request(app).put('/todos/abc').send({ completed: true });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete an existing todo', async () => {
      const todo = await createTodo(pool, sampleTodos.buyGroceries);

      const response = await request(app).delete(`/todos/${todo.id}`);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});

      const getAllResponse = await request(app).get('/todos');
      expect(getAllResponse.body).toHaveLength(0);
    });

    it('should delete only the specified todo', async () => {
      const todo1 = await createTodo(pool, { text: 'Todo 1' });
      const todo2 = await createTodo(pool, { text: 'Todo 2' });
      const todo3 = await createTodo(pool, { text: 'Todo 3' });

      await request(app).delete(`/todos/${todo2.id}`);

      const response = await request(app).get('/todos');
      expect(response.body).toHaveLength(2);
      expect(response.body.map((t: { id: number }) => t.id)).toEqual(
        expect.arrayContaining([todo1.id, todo3.id])
      );
      expect(response.body.map((t: { id: number }) => t.id)).not.toContain(todo2.id);
    });

    it('should return 404 when todo does not exist', async () => {
      const response = await request(app).delete('/todos/99999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 when id is not a valid number', async () => {
      const response = await request(app).delete('/todos/abc');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid consecutive requests', async () => {
      const requests = Array.from({ length: 10 }, (_, i) =>
        request(app).post('/todos').send({ text: `Todo ${i}` })
      );

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });

      const getAllResponse = await request(app).get('/todos');
      expect(getAllResponse.body).toHaveLength(10);
    });

    it('should handle special characters in text', async () => {
      const specialText = "Special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?`~";
      const response = await request(app).post('/todos').send({ text: specialText });

      expect(response.status).toBe(201);
      expect(response.body.text).toBe(specialText);
    });

    it('should handle unicode characters in text', async () => {
      const unicodeText = '你好世界 🌍 🎉 émojis and ñoñ-ASCII';
      const response = await request(app).post('/todos').send({ text: unicodeText });

      expect(response.status).toBe(201);
      expect(response.body.text).toBe(unicodeText);
    });

    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/todos')
        .set('Content-Type', 'application/json')
        .send('{ invalid json }');

      expect(response.status).toBe(400);
    });
  });
});
