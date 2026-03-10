import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../index.js';
import { authMiddleware } from '../middleware/auth.js';

export const authRouter = express.Router();

const createToken = (user) => {
  const payload = { id: user.id, email: user.email, name: user.name };
  const secret = process.env.JWT_SECRET || 'dev-secret';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

authRouter.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {};

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Email, имя и пароль обязательны' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Пользователь с таким email уже существует' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
      [email, passwordHash, name],
    );

    const user = { id: result.insertId, email, name };
    const token = createToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Register error', error);
    res.status(500).json({ message: 'Ошибка сервера при регистрации' });
  }
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const userRow = rows[0];
    const passwordOk = await bcrypt.compare(password, userRow.password_hash);
    if (!passwordOk) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    const user = { id: userRow.id, email: userRow.email, name: userRow.name };
    const token = createToken(user);

    res.json({ token, user });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ message: 'Ошибка сервера при входе' });
  }
});

authRouter.get('/me', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, email, name, created_at FROM users WHERE id = ?',
      [req.user.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Me error', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

