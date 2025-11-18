import { Todo } from '../../types/todo';

export const mockTodos: Todo[] = [
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

export const todoApi = {
  getTodos: jest.fn().mockResolvedValue(mockTodos),
  createTodo: jest.fn().mockImplementation((text: string) =>
    Promise.resolve({
      id: 3,
      text,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  ),
  updateTodo: jest.fn().mockImplementation((id: number, completed: boolean) =>
    Promise.resolve({
      ...mockTodos.find((t) => t.id === id)!,
      completed,
      updated_at: new Date().toISOString(),
    })
  ),
  deleteTodo: jest.fn().mockResolvedValue(undefined),
};
