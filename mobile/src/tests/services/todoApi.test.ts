import todoApi from '../../services/todoApi';
import { Todo } from '../../types';

describe('todoApi', () => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  const mockTodo: Todo = {
    id: 1,
    text: 'Test Todo',
    completed: false,
    created_at: '2025-11-18T10:00:00Z',
    updated_at: '2025-11-18T10:00:00Z',
  };

  const mockTodos: Todo[] = [
    mockTodo,
    {
      id: 2,
      text: 'Test Todo 2',
      completed: true,
      created_at: '2025-11-18T09:00:00Z',
      updated_at: '2025-11-18T09:00:00Z',
    },
  ];

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all todos successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockTodos,
      });

      const result = await todoApi.getAll();

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/todos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      expect(result).toEqual(mockTodos);
    });

    it('should handle empty todos array', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      const result = await todoApi.getAll();

      expect(result).toEqual([]);
    });

    it('should throw error on 404', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' }),
      });

      await expect(todoApi.getAll()).rejects.toThrow('Not found');
    });

    it('should throw error on 500', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' }),
      });

      await expect(todoApi.getAll()).rejects.toThrow('Internal server error');
    });

    it('should throw user-friendly error on 500 without error message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(todoApi.getAll()).rejects.toThrow(
        'Something went wrong on our end. Please try again.'
      );
    });

    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new TypeError('Network request failed'));

      await expect(todoApi.getAll()).rejects.toThrow(
        'Unable to connect. Please check your internet connection.'
      );
    });

    it('should handle malformed JSON response', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(todoApi.getAll()).rejects.toThrow(
        'Invalid input. Please check your todo and try again.'
      );
    });
  });

  describe('create', () => {
    it('should create a new todo successfully', async () => {
      const newTodo = { ...mockTodo, id: 3, text: 'New Todo' };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => newTodo,
      });

      const result = await todoApi.create('New Todo');

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'New Todo' }),
      });
      expect(result).toEqual(newTodo);
    });

    it('should throw error on 400 validation error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Text is required' }),
      });

      await expect(todoApi.create('')).rejects.toThrow('Text is required');
    });

    it('should throw user-friendly error on 400 without error message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({}),
      });

      await expect(todoApi.create('Test')).rejects.toThrow(
        'Invalid input. Please check your todo and try again.'
      );
    });

    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new TypeError('Network request failed'));

      await expect(todoApi.create('New Todo')).rejects.toThrow(
        'Unable to connect. Please check your internet connection.'
      );
    });

    it('should handle server error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Database error' }),
      });

      await expect(todoApi.create('New Todo')).rejects.toThrow('Database error');
    });

    it('should handle non-Error exceptions', async () => {
      (global.fetch as jest.Mock).mockRejectedValue('Unknown error');

      await expect(todoApi.create('New Todo')).rejects.toThrow(
        'Something went wrong. Please try again.'
      );
    });
  });

  describe('update', () => {
    it('should update a todo successfully', async () => {
      const updatedTodo = { ...mockTodo, completed: true };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => updatedTodo,
      });

      const result = await todoApi.update(1, true);

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/todos/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: true }),
      });
      expect(result).toEqual(updatedTodo);
    });

    it('should throw error on 404', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Todo not found' }),
      });

      await expect(todoApi.update(999, true)).rejects.toThrow('Todo not found');
    });

    it('should throw user-friendly error on 404 without error message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

      await expect(todoApi.update(999, true)).rejects.toThrow(
        'Todo not found. It may have been deleted.'
      );
    });

    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new TypeError('Network request failed'));

      await expect(todoApi.update(1, true)).rejects.toThrow(
        'Unable to connect. Please check your internet connection.'
      );
    });

    it('should handle server error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Update failed' }),
      });

      await expect(todoApi.update(1, true)).rejects.toThrow('Update failed');
    });

    it('should handle non-Error exceptions', async () => {
      (global.fetch as jest.Mock).mockRejectedValue('Unknown error');

      await expect(todoApi.update(1, true)).rejects.toThrow(
        'Something went wrong. Please try again.'
      );
    });
  });

  describe('delete', () => {
    it('should delete a todo successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 204,
        json: async () => null,
      });

      await expect(todoApi.delete(1)).resolves.toBeUndefined();

      expect(global.fetch).toHaveBeenCalledWith(`${API_BASE_URL}/todos/1`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    it('should handle 204 No Content response', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        status: 204,
      });

      await expect(todoApi.delete(1)).resolves.toBeUndefined();
    });

    it('should throw error on 404', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Todo not found' }),
      });

      await expect(todoApi.delete(999)).rejects.toThrow('Todo not found');
    });

    it('should throw user-friendly error on 404 without error message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

      await expect(todoApi.delete(999)).rejects.toThrow(
        'Todo not found. It may have been deleted.'
      );
    });

    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new TypeError('Network request failed'));

      await expect(todoApi.delete(1)).rejects.toThrow(
        'Unable to connect. Please check your internet connection.'
      );
    });

    it('should handle server error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Delete failed' }),
      });

      await expect(todoApi.delete(1)).rejects.toThrow('Delete failed');
    });

    it('should handle non-Error exceptions', async () => {
      (global.fetch as jest.Mock).mockRejectedValue('Unknown error');

      await expect(todoApi.delete(1)).rejects.toThrow('Something went wrong. Please try again.');
    });
  });

  describe('Error Message Mapping', () => {
    it('should map 400 status to user-friendly message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({}),
      });

      await expect(todoApi.getAll()).rejects.toThrow(
        'Invalid input. Please check your todo and try again.'
      );
    });

    it('should map 404 status to user-friendly message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({}),
      });

      await expect(todoApi.getAll()).rejects.toThrow('Todo not found. It may have been deleted.');
    });

    it('should map 500 status to user-friendly message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(todoApi.getAll()).rejects.toThrow(
        'Something went wrong on our end. Please try again.'
      );
    });

    it('should map 502 status to user-friendly message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({}),
      });

      await expect(todoApi.getAll()).rejects.toThrow(
        'Something went wrong on our end. Please try again.'
      );
    });

    it('should map 503 status to user-friendly message', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({}),
      });

      await expect(todoApi.getAll()).rejects.toThrow(
        'Something went wrong on our end. Please try again.'
      );
    });

    it('should use default message for unknown status codes', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 418,
        json: async () => ({}),
      });

      await expect(todoApi.getAll()).rejects.toThrow('Something went wrong. Please try again.');
    });

    it('should prefer server error message over default', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Custom error message' }),
      });

      await expect(todoApi.getAll()).rejects.toThrow('Custom error message');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string text in create', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Text is required' }),
      });

      await expect(todoApi.create('')).rejects.toThrow('Text is required');
    });

    it('should handle very long text in create', async () => {
      const longText = 'a'.repeat(1000);
      const newTodo = { ...mockTodo, text: longText };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => newTodo,
      });

      const result = await todoApi.create(longText);
      expect(result.text).toBe(longText);
    });

    it('should handle special characters in text', async () => {
      const specialText = 'Todo with @#$%^&*() chars!';
      const newTodo = { ...mockTodo, text: specialText };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => newTodo,
      });

      const result = await todoApi.create(specialText);
      expect(result.text).toBe(specialText);
    });

    it('should handle unicode characters in text', async () => {
      const unicodeText = 'Unicode: 你好 🎉 مرحبا';
      const newTodo = { ...mockTodo, text: unicodeText };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => newTodo,
      });

      const result = await todoApi.create(unicodeText);
      expect(result.text).toBe(unicodeText);
    });

    it('should handle zero as todo ID', async () => {
      const updatedTodo = { ...mockTodo, id: 0 };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => updatedTodo,
      });

      const result = await todoApi.update(0, true);
      expect(result.id).toBe(0);
    });

    it('should handle negative todo ID', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Todo not found' }),
      });

      await expect(todoApi.update(-1, true)).rejects.toThrow('Todo not found');
    });

    it('should handle very large todo ID', async () => {
      const largeId = 999999999;
      const updatedTodo = { ...mockTodo, id: largeId };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => updatedTodo,
      });

      const result = await todoApi.update(largeId, true);
      expect(result.id).toBe(largeId);
    });
  });
});
