import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { query } from './db/connection';
import config from './config';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT NOW()');

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      database: 'connected',
      dbTime: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'Reddit Stock Tracker API',
    version: '1.0.0',
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(config.port, () => {
  console.log(`Server running on http://localhose::${config.port}`);
  console.log(`Environment: ${config.port || 'development'}`);
});
