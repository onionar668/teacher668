import express from 'express';
import { db } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

export const coursesRouter = express.Router();

coursesRouter.post('/', authMiddleware, async (req, res) => {
  const { title, description, introduction, program, topic, isAiGenerated } = req.body || {};

  if (!title || !program) {
    return res.status(400).json({ message: 'Нет данных курса' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO courses (title, description, introduction, program_json, is_ai_generated, is_predefined, topic, owner_user_id)
       VALUES (?, ?, ?, ?, ?, 0, ?, ?)`,
      [
        title,
        description || '',
        introduction || '',
        JSON.stringify(program),
        isAiGenerated ? 1 : 0,
        topic || null,
        req.user.id,
      ],
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Save course error', error);
    res.status(500).json({ message: 'Ошибка сохранения курса' });
  }
});

coursesRouter.get('/my', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, title, description, introduction, program_json, is_ai_generated, topic, created_at
       FROM courses
       WHERE owner_user_id = ?`,
      [req.user.id],
    );

    const courses = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      introduction: row.introduction,
      program: row.program_json,
      isAiGenerated: !!row.is_ai_generated,
      topic: row.topic,
      createdAt: row.created_at,
    }));

    res.json({ courses });
  } catch (error) {
    console.error('List courses error', error);
    res.status(500).json({ message: 'Ошибка загрузки курсов' });
  }
});

coursesRouter.get('/fallback', async (req, res) => {
  const { topic } = req.query || {};
  try {
    let rows;
    if (topic) {
      [rows] = await db.query(
        `SELECT id, title, description, introduction, program_json
         FROM courses
         WHERE is_predefined = 1 AND (topic = ? OR title LIKE CONCAT('%', ?, '%'))
         ORDER BY id ASC
         LIMIT 1`,
        [topic, topic],
      );
    } else {
      [rows] = await db.query(
        `SELECT id, title, description, introduction, program_json
         FROM courses
         WHERE is_predefined = 1
         ORDER BY id ASC
         LIMIT 1`,
      );
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Резервный курс не найден' });
    }

    const row = rows[0];
    res.json({
      id: row.id,
      title: row.title,
      description: row.description,
      introduction: row.introduction,
      program: row.program_json,
      isAiGenerated: false,
      isFallback: true,
    });
  } catch (error) {
    console.error('Fallback course error', error);
    res.status(500).json({ message: 'Ошибка загрузки резервного курса' });
  }
});

