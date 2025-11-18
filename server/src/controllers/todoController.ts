import { Request, Response, NextFunction } from 'express';
import * as todoService from '../services/todoService';

export async function getTodos(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const todos = await todoService.getAllTodos();
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
}

export async function createTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { text } = req.body;
    const newTodo = await todoService.createTodo(text);
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
}

export async function updateTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    const { completed } = req.body;
    const updatedTodo = await todoService.updateTodoCompleted(id, completed);
    res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
}

export async function deleteTodo(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    await todoService.deleteTodo(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
