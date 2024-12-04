import { Router } from 'express';
import { z } from 'zod';
import { db } from '@/lib/db';
import { loginSchema, registerSchema, hashPassword, verifyPassword, generateToken } from '@/lib/auth';
import { generateId } from '@/lib/utils';

const router = Router();

router.post('/login', async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const { email, password } = result.data;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || !(await verifyPassword(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user.id, user.role);
  res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
});

router.post('/register', async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.errors });
  }

  const { email, password, name } = result.data;
  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  const hashedPassword = await hashPassword(password);
  const now = new Date().toISOString();
  const user = {
    id: generateId(),
    email,
    password: hashedPassword,
    name,
    role: 'user',
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(`
    INSERT INTO users (id, email, password, name, role, createdAt, updatedAt)
    VALUES (@id, @email, @password, @name, @role, @createdAt, @updatedAt)
  `).run(user);

  const token = generateToken(user.id, user.role);
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

export { router as authRouter };