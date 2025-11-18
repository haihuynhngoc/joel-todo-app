import { Router } from 'express';
import * as todoController from '../controllers/todoController';

const router = Router();

router.get('/', todoController.getTodos);
router.post('/', todoController.createTodo);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

export default router;
