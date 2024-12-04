import { Router } from 'express';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';

const router = Router();

router.get('/', (req, res) => {
  const devices = db.prepare('SELECT * FROM devices').all();
  res.json(devices);
});

router.post('/', (req, res) => {
  const { userId, serviceAccountId, name } = req.body;
  const now = new Date().toISOString();
  
  const device = {
    id: generateId(),
    userId,
    serviceAccountId,
    name,
    lastAccess: now,
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(`
    INSERT INTO devices (id, userId, serviceAccountId, name, lastAccess, createdAt, updatedAt)
    VALUES (@id, @userId, @serviceAccountId, @name, @lastAccess, @createdAt, @updatedAt)
  `).run(device);

  res.status(201).json(device);
});

export { router as devicesRouter };