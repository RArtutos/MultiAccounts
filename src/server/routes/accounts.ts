import { Router } from 'express';
import { db } from '@/lib/db';
import { generateId } from '@/lib/utils';

const router = Router();

router.get('/', (req, res) => {
  const accounts = db.prepare('SELECT * FROM service_accounts').all();
  res.json(accounts);
});

router.post('/', (req, res) => {
  const { name, type, credentials, logo, maxDevices } = req.body;
  const now = new Date().toISOString();
  
  const account = {
    id: generateId(),
    name,
    type,
    credentials: JSON.stringify(credentials),
    logo,
    maxDevices,
    createdAt: now,
    updatedAt: now,
  };

  db.prepare(`
    INSERT INTO service_accounts (id, name, type, credentials, logo, maxDevices, createdAt, updatedAt)
    VALUES (@id, @name, @type, @credentials, @logo, @maxDevices, @createdAt, @updatedAt)
  `).run(account);

  res.status(201).json(account);
});

export { router as accountsRouter };