import { Router } from 'express';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';

const router = Router();

router.get('/', (req, res) => {
  const logs = db.prepare('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 100').all();
  res.json(logs);
});

router.post('/', (req, res) => {
  const { userId, serviceAccountId, deviceId, action, details } = req.body;
  
  const log = {
    id: generateId(),
    userId,
    serviceAccountId,
    deviceId,
    action,
    details: JSON.stringify(details),
    timestamp: new Date().toISOString(),
  };

  db.prepare(`
    INSERT INTO activity_logs (id, userId, serviceAccountId, deviceId, action, details, timestamp)
    VALUES (@id, @userId, @serviceAccountId, @deviceId, @action, @details, @timestamp)
  `).run(log);

  res.status(201).json(log);
});

export { router as logsRouter };