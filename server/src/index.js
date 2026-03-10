import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createPool } from 'mysql2/promise';

import { authRouter } from './routes/auth.js';
import { coursesRouter } from './routes/courses.js';
import { questsRouter } from './routes/quests.js';
import { seedQuestsAndAchievements } from './db/seedQuests.js';

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

export const db = createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'adil_teacher',
  waitForConnections: true,
  connectionLimit: 10,
});

// Seed initial achievements and 40 quests once
seedQuestsAndAchievements(db);

app.get('/api/health', async (_req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    console.error('DB health check failed', error);
    res.status(500).json({ status: 'error', message: 'DB connection failed' });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/quests', questsRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});

