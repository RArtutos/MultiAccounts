import { Router } from 'express';
import { db } from '@/lib/db';

const router = Router();

router.get('/', (req, res) => {
  const users = db.prepare('SELECT id, email, name, role, createdAt, updatedAt FROM users').all();
  res.json(users);
});

export { router as usersRouter };