import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AddTodoForm } from '../../components/AddTodoForm';

describe('AddTodoForm', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render input field with placeholder', () => {
      const { getByPlaceholderText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      expect(getByPlaceholderText('What needs to be done?')).toBeTruthy();
    });

    it('should render Add button', () => {
      const { getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      expect(getByLabelText('Add todo')).toBeTruthy();
    });

    it('should render button with disabled state initially when input is empty', () => {
      const { getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const addButton = getByLabelText('Add todo');
      expect(addButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should render ActivityIndicator when loading', () => {
      const { getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} loading={true} />);

      const addButton = getByLabelText('Add todo');
      expect(addButton).toBeTruthy();
    });

    it('should not render Add text when loading', () => {
      const { queryByText } = render(<AddTodoForm onAdd={mockOnAdd} loading={true} />);

      expect(queryByText('Add')).toBeNull();
    });
  });

  describe('Input Interactions', () => {
    it('should update input value when text is entered', () => {
      const { getByPlaceholderText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, 'New Todo');

      expect(input.props.value).toBe('New Todo');
    });

    it('should enable button when input has text', () => {
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, 'New Todo');

      const addButton = getByLabelText('Add todo');
      expect(addButton.props.accessibilityState.disabled).toBe(false);
    });

    it('should keep button disabled when input has only whitespace', () => {
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, '   ');

      const addButton = getByLabelText('Add todo');
      expect(addButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should allow text up to 500 characters', () => {
      const { getByPlaceholderText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      const longText = 'a'.repeat(500);
      fireEvent.changeText(input, longText);

      expect(input.props.value).toBe(longText);
    });

    it('should have maxLength prop set to 500', () => {
      const { getByPlaceholderText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      expect(input.props.maxLength).toBe(500);
    });
  });

  describe('Form Submission', () => {
    it('should call onAdd with trimmed text when button is pressed', async () => {
      mockOnAdd.mockResolvedValue(undefined);
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, 'New Todo');

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledTimes(1);
        expect(mockOnAdd).toHaveBeenCalledWith('New Todo');
      });
    });

    it('should trim whitespace from input before calling onAdd', async () => {
      mockOnAdd.mockResolvedValue(undefined);
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, '  Todo with spaces  ');

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('Todo with spaces');
      });
    });

    it('should clear input after successful submission', async () => {
      mockOnAdd.mockResolvedValue(undefined);
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, 'New Todo');

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(input.props.value).toBe('');
      });
    });

    it('should call onAdd when input is submitted with keyboard', async () => {
      mockOnAdd.mockResolvedValue(undefined);
      const { getByPlaceholderText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, 'New Todo');
      fireEvent(input, 'submitEditing');

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith('New Todo');
      });
    });

    it('should not call onAdd when input is empty', () => {
      const { getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should not call onAdd when input has only whitespace', () => {
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, '   ');

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      expect(mockOnAdd).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should disable button when loading', () => {
      const { getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} loading={true} />);

      const addButton = getByLabelText('Add todo');
      expect(addButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should not allow submission when loading', () => {
      const { getByLabelText, getByPlaceholderText } = render(
        <AddTodoForm onAdd={mockOnAdd} loading={true} />
      );

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, 'New Todo');

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      expect(mockOnAdd).not.toHaveBeenCalled();
    });

    it('should keep input value when loading', () => {
      const { getByPlaceholderText, rerender } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, 'New Todo');

      rerender(<AddTodoForm onAdd={mockOnAdd} loading={true} />);

      expect(input.props.value).toBe('New Todo');
    });
  });

  describe('Error Handling', () => {
    it('should handle onAdd rejection gracefully', async () => {
      mockOnAdd.mockRejectedValue(new Error('Network error'));
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, 'New Todo');

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalled();
      });
    });

    it('should not clear input when onAdd fails', async () => {
      mockOnAdd.mockRejectedValue(new Error('Network error'));
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, 'New Todo');

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalled();
      });

      expect(input.props.value).toBe('New Todo');
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility label for input', () => {
      const { getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      expect(getByLabelText('New todo text')).toBeTruthy();
    });

    it('should have correct accessibility hint for input', () => {
      const { getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByLabelText('New todo text');
      expect(input.props.accessibilityHint).toBe('Maximum 500 characters');
    });

    it('should have correct accessibility role for button', () => {
      const { getByRole } = render(<AddTodoForm onAdd={mockOnAdd} />);

      expect(getByRole('button')).toBeTruthy();
    });

    it('should update button disabled state in accessibility', () => {
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const addButton = getByLabelText('Add todo');
      expect(addButton.props.accessibilityState.disabled).toBe(true);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, 'New Todo');

      expect(addButton.props.accessibilityState.disabled).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid consecutive submissions', async () => {
      mockOnAdd.mockResolvedValue(undefined);
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      fireEvent.changeText(input, 'Todo 1');

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(input.props.value).toBe('');
      });

      fireEvent.changeText(input, 'Todo 2');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle special characters in input', async () => {
      mockOnAdd.mockResolvedValue(undefined);
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      const specialText = 'Todo with @#$%^&*() chars!';
      fireEvent.changeText(input, specialText);

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(specialText);
      });
    });

    it('should handle unicode characters in input', async () => {
      mockOnAdd.mockResolvedValue(undefined);
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      const unicodeText = 'Unicode: 你好 🎉 مرحبا';
      fireEvent.changeText(input, unicodeText);

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(unicodeText);
      });
    });

    it('should handle maximum length input', async () => {
      mockOnAdd.mockResolvedValue(undefined);
      const { getByPlaceholderText, getByLabelText } = render(<AddTodoForm onAdd={mockOnAdd} />);

      const input = getByPlaceholderText('What needs to be done?');
      const maxText = 'a'.repeat(500);
      fireEvent.changeText(input, maxText);

      const addButton = getByLabelText('Add todo');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(mockOnAdd).toHaveBeenCalledWith(maxText);
      });
    });
  });
});
