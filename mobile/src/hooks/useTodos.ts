/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types';
import todoApi from '../services/todoApi';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fetchTodos: () => Promise<void>;
  refreshTodos: () => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  clearError: () => void;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedTodos = await todoApi.getAll();
      setTodos(fetchedTodos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch todos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTodo = useCallback(async (text: string) => {
    try {
      setLoading(true);
      setError(null);

      const newTodo = await todoApi.create(text);

      setTodos((prev) => [newTodo, ...prev]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create todo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleTodo = useCallback(
    async (id: number) => {
      try {
        setError(null);

        const todoToToggle = todos.find((t) => t.id === id);
        if (!todoToToggle) {
          throw new Error('Todo not found');
        }

        const optimisticTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(optimisticTodos);

        const updatedTodo = await todoApi.update(id, !todoToToggle.completed);

        setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
        setError(errorMessage);

        await fetchTodos();
      }
    },
    [todos, fetchTodos]
  );

  const deleteTodo = useCallback(
    async (id: number) => {
      try {
        setError(null);

        setTodos((prev) => prev.filter((todo) => todo.id !== id));

        await todoApi.delete(id);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
        setError(errorMessage);

        await fetchTodos();
      }
    },
    [fetchTodos]
  );

  const refreshTodos = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const fetchedTodos = await todoApi.getAll();
      setTodos(fetchedTodos);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh todos';
      setError(errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    refreshing,
    error,
    fetchTodos,
    refreshTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearError,
  };
}
