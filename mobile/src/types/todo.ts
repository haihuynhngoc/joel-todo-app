export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  text: string;
}

export interface UpdateTodoRequest {
  completed: boolean;
}
