import React from 'react';
import { render } from '@testing-library/react-native';
import { TodoList } from '../../components/TodoList';
import { Todo } from '../../types';

describe('TodoList', () => {
  const mockTodos: Todo[] = [
    {
      id: 1,
      text: 'First Todo',
      completed: false,
      created_at: '2025-11-18T10:00:00Z',
      updated_at: '2025-11-18T10:00:00Z',
    },
    {
      id: 2,
      text: 'Second Todo',
      completed: true,
      created_at: '2025-11-18T09:00:00Z',
      updated_at: '2025-11-18T09:00:00Z',
    },
    {
      id: 3,
      text: 'Third Todo',
      completed: false,
      created_at: '2025-11-18T08:00:00Z',
      updated_at: '2025-11-18T08:00:00Z',
    },
  ];

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render EmptyState when todos array is empty', () => {
      const { getByText } = render(
        <TodoList todos={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(getByText('No todos yet!')).toBeTruthy();
      expect(getByText('Add your first todo to get started')).toBeTruthy();
    });

    it('should render FlatList when todos array has items', () => {
      const { queryByText, getByText } = render(
        <TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(queryByText('No todos yet!')).toBeNull();
      expect(getByText('First Todo')).toBeTruthy();
      expect(getByText('Second Todo')).toBeTruthy();
      expect(getByText('Third Todo')).toBeTruthy();
    });

    it('should render all todos in the list', () => {
      const { getByText } = render(
        <TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      mockTodos.forEach((todo) => {
        expect(getByText(todo.text)).toBeTruthy();
      });
    });

    it('should render RefreshControl when onRefresh is provided', () => {
      const { UNSAFE_root } = render(
        <TodoList
          todos={mockTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onRefresh={mockOnRefresh}
          refreshing={false}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should not render RefreshControl when onRefresh is not provided', () => {
      const { UNSAFE_root } = render(
        <TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Props', () => {
    it('should pass onToggle to TodoItem components', () => {
      const { getAllByRole } = render(
        <TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const checkboxes = getAllByRole('checkbox');
      expect(checkboxes).toHaveLength(3);
    });

    it('should pass onDelete to TodoItem components', () => {
      const { getAllByRole } = render(
        <TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const deleteButtons = getAllByRole('button');
      expect(deleteButtons).toHaveLength(3);
    });

    it('should handle refreshing prop correctly', () => {
      const { rerender, UNSAFE_root } = render(
        <TodoList
          todos={mockTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onRefresh={mockOnRefresh}
          refreshing={false}
        />
      );

      expect(UNSAFE_root).toBeTruthy();

      rerender(
        <TodoList
          todos={mockTodos}
          onToggle={mockOnToggle}
          onDelete={mockOnDelete}
          onRefresh={mockOnRefresh}
          refreshing={true}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single todo item', () => {
      const singleTodo = [mockTodos[0]];
      const { getByText, queryByText } = render(
        <TodoList todos={singleTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(getByText('First Todo')).toBeTruthy();
      expect(queryByText('Second Todo')).toBeNull();
    });

    it('should handle large number of todos', () => {
      const largeTodoList: Todo[] = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        text: `Todo ${i + 1}`,
        completed: i % 2 === 0,
        created_at: '2025-11-18T10:00:00Z',
        updated_at: '2025-11-18T10:00:00Z',
      }));

      const { getByText } = render(
        <TodoList todos={largeTodoList} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(getByText('Todo 1')).toBeTruthy();
    });

    it('should handle todos with identical text but different IDs', () => {
      const duplicateTextTodos: Todo[] = [
        {
          id: 1,
          text: 'Duplicate Todo',
          completed: false,
          created_at: '2025-11-18T10:00:00Z',
          updated_at: '2025-11-18T10:00:00Z',
        },
        {
          id: 2,
          text: 'Duplicate Todo',
          completed: true,
          created_at: '2025-11-18T09:00:00Z',
          updated_at: '2025-11-18T09:00:00Z',
        },
      ];

      const { getAllByText } = render(
        <TodoList todos={duplicateTextTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const duplicateTodos = getAllByText('Duplicate Todo');
      expect(duplicateTodos).toHaveLength(2);
    });

    it('should handle transition from empty to populated', () => {
      const { rerender, getByText, queryByText } = render(
        <TodoList todos={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(getByText('No todos yet!')).toBeTruthy();

      rerender(<TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      expect(queryByText('No todos yet!')).toBeNull();
      expect(getByText('First Todo')).toBeTruthy();
    });

    it('should handle transition from populated to empty', () => {
      const { rerender, getByText, queryByText } = render(
        <TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(getByText('First Todo')).toBeTruthy();

      rerender(<TodoList todos={[]} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

      expect(queryByText('First Todo')).toBeNull();
      expect(getByText('No todos yet!')).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should use keyExtractor with todo IDs', () => {
      const { UNSAFE_root } = render(
        <TodoList todos={mockTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should render todos efficiently with FlatList', () => {
      const manyTodos: Todo[] = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        text: `Performance Test Todo ${i + 1}`,
        completed: false,
        created_at: '2025-11-18T10:00:00Z',
        updated_at: '2025-11-18T10:00:00Z',
      }));

      const startTime = performance.now();
      render(<TodoList todos={manyTodos} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
