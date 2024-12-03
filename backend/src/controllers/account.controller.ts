import { Request, Response } from 'express';
import { sql } from '../database/setup.js';
import { logger } from '../utils/logger.js';

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await sql`
      SELECT a.id, s.name as service, a.status, 
      (SELECT COUNT(*) FROM sessions WHERE account_id = a.id) as current_users,
      a.max_users
      FROM accounts a
      JOIN streaming_services s ON a.service_id = s.id
    `;
    
    res.json({ accounts });
  } catch (error) {
    logger.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Error al obtener las cuentas' });
  }
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { serviceId, credentials, maxUsers } = req.body;
    
    const [account] = await sql`
      INSERT INTO accounts (service_id, credentials, max_users, status)
      VALUES (${serviceId}, ${JSON.stringify(credentials)}, ${maxUsers}, 'active')
      RETURNING id, service_id, max_users, status
    `;
    
    res.status(201).json(account);
  } catch (error) {
    logger.error('Error creating account:', error);
    res.status(500).json({ error: 'Error al crear la cuenta' });
  }
};