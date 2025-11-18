import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useTodos } from '../../hooks/useTodos';
import todoApi from '../../services/todoApi';
import { Todo } from '../../types';

jest.mock('../../services/todoApi');

const mockTodoApi = todoApi as jest.Mocked<typeof todoApi>;

describe('useTodos', () => {
  const mockTodos: Todo[] = [
    {
      id: 1,
      text: 'Test Todo 1',
      completed: false,
      created_at: '2025-11-18T10:00:00Z',
      updated_at: '2025-11-18T10:00:00Z',
    },
    {
      id: 2,
      text: 'Test Todo 2',
      completed: true,
      created_at: '2025-11-18T09:00:00Z',
      updated_at: '2025-11-18T09:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockTodoApi.getAll.mockResolvedValue(mockTodos);
  });

  describe('Initial State', () => {
    it('should initialize with empty todos array', async () => {
      const { result } = renderHook(() => useTodos());

      expect(result.current.todos).toEqual([]);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should initialize with loading as false after mount', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should initialize with refreshing as false', async () => {
      const { result } = renderHook(() => useTodos());

      expect(result.current.refreshing).toBe(false);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should initialize with error as null', async () => {
      const { result } = renderHook(() => useTodos());

      expect(result.current.error).toBeNull();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('fetchTodos', () => {
    it('should fetch todos on mount', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(mockTodoApi.getAll).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });
    });

    it('should set loading to true while fetching', async () => {
      mockTodoApi.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockTodos), 100))
      );

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });
    });

    it('should set loading to false after fetching', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle fetch error', async () => {
      mockTodoApi.getAll.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });
    });

    it('should handle non-Error fetch failures', async () => {
      mockTodoApi.getAll.mockRejectedValue('Unknown error');

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to fetch todos');
      });
    });

    it('should clear error on successful fetch', async () => {
      mockTodoApi.getAll.mockRejectedValueOnce(new Error('Network error'));
      mockTodoApi.getAll.mockResolvedValueOnce(mockTodos);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      act(() => {
        result.current.fetchTodos();
      });

      await waitFor(() => {
        expect(result.current.error).toBeNull();
      });
    });
  });

  describe('addTodo', () => {
    it('should add a new todo', async () => {
      const newTodo: Todo = {
        id: 3,
        text: 'New Todo',
        completed: false,
        created_at: '2025-11-18T11:00:00Z',
        updated_at: '2025-11-18T11:00:00Z',
      };

      mockTodoApi.create.mockResolvedValue(newTodo);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      await act(async () => {
        await result.current.addTodo('New Todo');
      });

      expect(mockTodoApi.create).toHaveBeenCalledWith('New Todo');
      expect(result.current.todos).toEqual([newTodo, ...mockTodos]);
    });

    it('should set loading to true while adding', async () => {
      const newTodo: Todo = {
        id: 3,
        text: 'New Todo',
        completed: false,
        created_at: '2025-11-18T11:00:00Z',
        updated_at: '2025-11-18T11:00:00Z',
      };

      mockTodoApi.create.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(newTodo), 100))
      );

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.addTodo('New Todo');
      });

      await waitFor(() => {
        expect(result.current.loading).toBe(true);
      });
    });

    it('should handle add error', async () => {
      mockTodoApi.create.mockRejectedValue(new Error('Failed to create'));

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      await act(async () => {
        await result.current.addTodo('New Todo');
      });

      expect(result.current.error).toBe('Failed to create');
      expect(result.current.todos).toEqual(mockTodos);
    });

    it('should handle non-Error add failures', async () => {
      mockTodoApi.create.mockRejectedValue('Unknown error');

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      await act(async () => {
        await result.current.addTodo('New Todo');
      });

      expect(result.current.error).toBe('Failed to create todo');
    });
  });

  describe('toggleTodo', () => {
    it('should toggle todo completion optimistically', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      const updatedTodo = { ...mockTodos[0], completed: true };
      mockTodoApi.update.mockResolvedValue(updatedTodo);

      act(() => {
        result.current.toggleTodo(1);
      });

      await waitFor(() => {
        expect(result.current.todos[0].completed).toBe(true);
      });
    });

    it('should call API with correct parameters', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      const updatedTodo = { ...mockTodos[0], completed: true };
      mockTodoApi.update.mockResolvedValue(updatedTodo);

      await act(async () => {
        await result.current.toggleTodo(1);
      });

      expect(mockTodoApi.update).toHaveBeenCalledWith(1, true);
    });

    it('should update todo with server response', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      const updatedTodo = {
        ...mockTodos[0],
        completed: true,
        updated_at: '2025-11-18T12:00:00Z',
      };
      mockTodoApi.update.mockResolvedValue(updatedTodo);

      await act(async () => {
        await result.current.toggleTodo(1);
      });

      expect(result.current.todos[0]).toEqual(updatedTodo);
    });

    it('should handle toggle error and refetch', async () => {
      mockTodoApi.update.mockRejectedValue(new Error('Update failed'));

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      const getAllCallCount = mockTodoApi.getAll.mock.calls.length;

      await act(async () => {
        await result.current.toggleTodo(1);
      });

      await waitFor(() => {
        expect(mockTodoApi.getAll.mock.calls.length).toBeGreaterThan(getAllCallCount);
      });
    });

    it('should handle non-existent todo', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      const getAllCallCount = mockTodoApi.getAll.mock.calls.length;

      await act(async () => {
        await result.current.toggleTodo(999);
      });

      await waitFor(() => {
        expect(mockTodoApi.getAll.mock.calls.length).toBeGreaterThan(getAllCallCount);
      });
    });

    it('should handle non-Error toggle failures', async () => {
      mockTodoApi.update.mockRejectedValue('Unknown error');

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      const getAllCallCount = mockTodoApi.getAll.mock.calls.length;

      await act(async () => {
        await result.current.toggleTodo(1);
      });

      await waitFor(() => {
        expect(mockTodoApi.getAll.mock.calls.length).toBeGreaterThan(getAllCallCount);
      });
    });
  });

  describe('deleteTodo', () => {
    it('should delete todo optimistically', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      mockTodoApi.delete.mockResolvedValue(undefined);

      act(() => {
        result.current.deleteTodo(1);
      });

      await waitFor(() => {
        expect(result.current.todos).toHaveLength(1);
        expect(result.current.todos[0].id).toBe(2);
      });
    });

    it('should call API with correct ID', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      mockTodoApi.delete.mockResolvedValue(undefined);

      await act(async () => {
        await result.current.deleteTodo(1);
      });

      expect(mockTodoApi.delete).toHaveBeenCalledWith(1);
    });

    it('should handle delete error and refetch', async () => {
      mockTodoApi.delete.mockRejectedValue(new Error('Delete failed'));

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      const getAllCallCount = mockTodoApi.getAll.mock.calls.length;

      await act(async () => {
        await result.current.deleteTodo(1);
      });

      await waitFor(() => {
        expect(mockTodoApi.getAll.mock.calls.length).toBeGreaterThan(getAllCallCount);
      });
    });

    it('should handle non-Error delete failures', async () => {
      mockTodoApi.delete.mockRejectedValue('Unknown error');

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      const getAllCallCount = mockTodoApi.getAll.mock.calls.length;

      await act(async () => {
        await result.current.deleteTodo(1);
      });

      await waitFor(() => {
        expect(mockTodoApi.getAll.mock.calls.length).toBeGreaterThan(getAllCallCount);
      });
    });
  });

  describe('refreshTodos', () => {
    it('should refresh todos', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      const updatedTodos = [
        ...mockTodos,
        {
          id: 3,
          text: 'New Todo',
          completed: false,
          created_at: '2025-11-18T11:00:00Z',
          updated_at: '2025-11-18T11:00:00Z',
        },
      ];

      mockTodoApi.getAll.mockResolvedValue(updatedTodos);

      await act(async () => {
        await result.current.refreshTodos();
      });

      expect(result.current.todos).toEqual(updatedTodos);
    });

    it('should set refreshing to true while refreshing', async () => {
      mockTodoApi.getAll.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(mockTodos), 100))
      );

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      act(() => {
        result.current.refreshTodos();
      });

      await waitFor(() => {
        expect(result.current.refreshing).toBe(true);
      });
    });

    it('should set refreshing to false after refresh', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshTodos();
      });

      expect(result.current.refreshing).toBe(false);
    });

    it('should handle refresh error', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      mockTodoApi.getAll.mockRejectedValue(new Error('Refresh failed'));

      await act(async () => {
        await result.current.refreshTodos();
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Refresh failed');
      });
    });

    it('should handle non-Error refresh failures', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      mockTodoApi.getAll.mockRejectedValue('Unknown error');

      await act(async () => {
        await result.current.refreshTodos();
      });

      expect(result.current.error).toBe('Failed to refresh todos');
    });
  });

  describe('clearError', () => {
    it('should clear error state', async () => {
      mockTodoApi.getAll.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should not affect other state when clearing error', async () => {
      mockTodoApi.getAll.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.error).toBe('Network error');
      });

      const todosBefore = result.current.todos;
      const loadingBefore = result.current.loading;

      act(() => {
        result.current.clearError();
      });

      expect(result.current.todos).toEqual(todosBefore);
      expect(result.current.loading).toBe(loadingBefore);
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple simultaneous operations', async () => {
      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual(mockTodos);
      });

      const newTodo: Todo = {
        id: 3,
        text: 'New Todo',
        completed: false,
        created_at: '2025-11-18T11:00:00Z',
        updated_at: '2025-11-18T11:00:00Z',
      };

      mockTodoApi.create.mockResolvedValue(newTodo);
      mockTodoApi.delete.mockResolvedValue(undefined);

      await act(async () => {
        await Promise.all([result.current.addTodo('New Todo'), result.current.deleteTodo(2)]);
      });

      expect(mockTodoApi.create).toHaveBeenCalled();
      expect(mockTodoApi.delete).toHaveBeenCalled();
    });

    it('should handle empty todos array operations', async () => {
      mockTodoApi.getAll.mockResolvedValue([]);

      const { result } = renderHook(() => useTodos());

      await waitFor(() => {
        expect(result.current.todos).toEqual([]);
      });

      const newTodo: Todo = {
        id: 1,
        text: 'First Todo',
        completed: false,
        created_at: '2025-11-18T11:00:00Z',
        updated_at: '2025-11-18T11:00:00Z',
      };

      mockTodoApi.create.mockResolvedValue(newTodo);

      await act(async () => {
        await result.current.addTodo('First Todo');
      });

      expect(result.current.todos).toEqual([newTodo]);
    });
  });
});
