import express, { Express } from 'express';
import cors from 'cors';
import todoRoutes from '../../routes/todoRoutes';
import { errorHandler } from '../../middleware/errorHandler';

export function createTestApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/todos', todoRoutes);

  app.use(errorHandler);

  return app;
}
