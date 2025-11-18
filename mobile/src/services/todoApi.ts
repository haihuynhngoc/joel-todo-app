import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../types';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage: string;

    try {
      const errorData = await response.json();

      if (errorData.error) {
        errorMessage = errorData.error;
      } else {
        errorMessage = getUserFriendlyErrorMessage(response.status);
      }
    } catch {
      errorMessage = getUserFriendlyErrorMessage(response.status);
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null as T;
  }

  return await response.json();
}

function getUserFriendlyErrorMessage(status: number): string {
  switch (status) {
    case 400:
      return 'Invalid input. Please check your todo and try again.';
    case 404:
      return 'Todo not found. It may have been deleted.';
    case 500:
    case 502:
    case 503:
      return 'Something went wrong on our end. Please try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export async function getAll(): Promise<Todo[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return await handleResponse<Todo[]>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to connect. Please check your internet connection.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Something went wrong. Please try again.');
  }
}

export async function create(text: string): Promise<Todo> {
  try {
    const requestBody: CreateTodoRequest = { text };

    const response = await fetch(`${API_BASE_URL}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    return await handleResponse<Todo>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to connect. Please check your internet connection.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Something went wrong. Please try again.');
  }
}

export async function update(id: number, completed: boolean): Promise<Todo> {
  try {
    const requestBody: UpdateTodoRequest = { completed };

    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    return await handleResponse<Todo>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to connect. Please check your internet connection.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Something went wrong. Please try again.');
  }
}

export async function deleteTodo(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await handleResponse<void>(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Unable to connect. Please check your internet connection.');
    }

    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Something went wrong. Please try again.');
  }
}

export default {
  getAll,
  create,
  update,
  delete: deleteTodo,
};
