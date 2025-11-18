export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTodoDTO {
  text: string;
}

export interface UpdateTodoDTO {
  completed: boolean;
}
