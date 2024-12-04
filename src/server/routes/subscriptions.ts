import { Router } from 'express';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';

const router = Router();

router.get('/', (req, res) => {
  const subscriptions = db.prepare('SELECT * FROM subscriptions').all();
  res.json(subscriptions);
});

router.post('/', (req, res) => {
  const { userId, serviceAccountId, startDate, endDate } = req.body;
  const now = new Date().toISOString();
  
  const subscription = {
    id: generateId(),
    userId,
    serviceAccountId,
    startDate,
    endDate,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(`
    INSERT INTO subscriptions (id, userId, serviceAccountId, startDate, endDate, status, createdAt, updatedAt)
    VALUES (@id, @userId, @serviceAccountId, @startDate, @endDate, @status, @createdAt, @updatedAt)
  `).run(subscription);

  res.status(201).json(subscription);
});

export { router as subscriptionsRouter };