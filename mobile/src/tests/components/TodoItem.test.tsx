import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TodoItem } from '../../components/TodoItem';
import { Todo } from '../../types';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    text: 'Test Todo',
    completed: false,
    created_at: '2025-11-18T10:00:00Z',
    updated_at: '2025-11-18T10:00:00Z',
  };

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render todo text correctly', () => {
      const { getByText } = render(
        <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(getByText('Test Todo')).toBeTruthy();
    });

    it('should render unchecked checkbox for incomplete todo', () => {
      const { getByRole } = render(
        <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const checkbox = getByRole('checkbox');
      expect(checkbox).toBeTruthy();
      expect(checkbox.props.accessibilityState.checked).toBe(false);
    });

    it('should render checked checkbox for completed todo', () => {
      const completedTodo = { ...mockTodo, completed: true };
      const { getByRole, getByText } = render(
        <TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityState.checked).toBe(true);
      expect(getByText('✓')).toBeTruthy();
    });

    it('should render delete button', () => {
      const { getByLabelText } = render(
        <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(getByLabelText('Delete "Test Todo"')).toBeTruthy();
    });

    it('should display long text correctly', () => {
      const longTextTodo = {
        ...mockTodo,
        text: 'This is a very long todo text that should be displayed correctly without any issues even when it exceeds the normal length',
      };

      const { getByText } = render(
        <TodoItem todo={longTextTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(getByText(longTextTodo.text)).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('should call onToggle when checkbox is pressed', () => {
      const { getByRole } = render(
        <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const checkbox = getByRole('checkbox');
      fireEvent.press(checkbox);

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
      expect(mockOnToggle).toHaveBeenCalledWith(1);
    });

    it('should call onToggle when todo text is pressed', () => {
      const { getByText } = render(
        <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const todoText = getByText('Test Todo');
      fireEvent.press(todoText);

      expect(mockOnToggle).toHaveBeenCalledTimes(1);
      expect(mockOnToggle).toHaveBeenCalledWith(1);
    });

    it('should call onDelete when delete button is pressed', () => {
      const { getByLabelText } = render(
        <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const deleteButton = getByLabelText('Delete "Test Todo"');
      fireEvent.press(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(1);
    });

    it('should not call onDelete when checkbox is pressed', () => {
      const { getByRole } = render(
        <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const checkbox = getByRole('checkbox');
      fireEvent.press(checkbox);

      expect(mockOnDelete).not.toHaveBeenCalled();
    });

    it('should not call onToggle when delete button is pressed', () => {
      const { getByLabelText } = render(
        <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const deleteButton = getByLabelText('Delete "Test Todo"');
      fireEvent.press(deleteButton);

      expect(mockOnToggle).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility label for incomplete todo', () => {
      const { getByRole } = render(
        <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityLabel).toBe('Mark "Test Todo" as complete');
    });

    it('should have correct accessibility label for completed todo', () => {
      const completedTodo = { ...mockTodo, completed: true };
      const { getByRole } = render(
        <TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const checkbox = getByRole('checkbox');
      expect(checkbox.props.accessibilityLabel).toBe('Mark "Test Todo" as incomplete');
    });

    it('should have correct accessibility role for delete button', () => {
      const { getByRole } = render(
        <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const deleteButton = getByRole('button');
      expect(deleteButton).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in todo text', () => {
      const specialCharTodo = {
        ...mockTodo,
        text: 'Todo with @#$%^&*() special chars!',
      };

      const { getByText } = render(
        <TodoItem todo={specialCharTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(getByText('Todo with @#$%^&*() special chars!')).toBeTruthy();
    });

    it('should handle unicode characters in todo text', () => {
      const unicodeTodo = {
        ...mockTodo,
        text: 'Unicode todo: 你好 🎉 مرحبا',
      };

      const { getByText } = render(
        <TodoItem todo={unicodeTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(getByText('Unicode todo: 你好 🎉 مرحبا')).toBeTruthy();
    });

    it('should handle empty string todo text', () => {
      const emptyTodo = {
        ...mockTodo,
        text: '',
      };

      const { root } = render(
        <TodoItem todo={emptyTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      expect(root).toBeTruthy();
    });

    it('should handle rapid consecutive presses', () => {
      const { getByRole } = render(
        <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
      );

      const checkbox = getByRole('checkbox');
      fireEvent.press(checkbox);
      fireEvent.press(checkbox);
      fireEvent.press(checkbox);

      expect(mockOnToggle).toHaveBeenCalledTimes(3);
    });
  });
});
