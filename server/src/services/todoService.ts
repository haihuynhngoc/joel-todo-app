import * as todoRepository from '../repositories/todoRepository';
import { Todo } from '../models/todo';

export async function getAllTodos(): Promise<Todo[]> {
  return await todoRepository.findAll();
}

export async function createTodo(text: string): Promise<Todo> {
  if (text === undefined || text === null) {
    throw new Error('Text is required');
  }

  if (typeof text !== 'string') {
    throw new Error('Text must be a string');
  }

  const trimmedText = text.trim();

  if (trimmedText.length === 0) {
    throw new Error('Text cannot be empty');
  }

  if (trimmedText.length > 500) {
    throw new Error('Text must be 500 characters or less');
  }

  return await todoRepository.create(trimmedText);
}

export async function updateTodoCompleted(id: number, completed: boolean): Promise<Todo> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid todo ID');
  }

  if (typeof completed !== 'boolean') {
    throw new Error('Completed must be a boolean');
  }

  const updatedTodo = await todoRepository.updateCompleted(id, completed);

  if (!updatedTodo) {
    throw new Error('Todo not found');
  }

  return updatedTodo;
}

export async function deleteTodo(id: number): Promise<void> {
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Invalid todo ID');
  }

  const deleted = await todoRepository.deleteById(id);

  if (!deleted) {
    throw new Error('Todo not found');
  }
}
