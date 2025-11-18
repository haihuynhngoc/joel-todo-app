import express from 'express';
import cors from 'cors';
import config from './config';
import todoRoutes from './routes/todoRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/todos', todoRoutes);

app.use(errorHandler);

if (require.main === module) {
  const port = config.server.port;
  app.listen(port, () => {
    console.log(`Server running on port ${port} in ${config.server.nodeEnv} mode`);
  });
}

export default app;
