import { Request, Response } from 'express';
import { sql } from '../database/setup';
import { logger } from '../utils/logger';

export const getAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await sql`
      SELECT id, service, status, 
      (SELECT COUNT(*) FROM sessions WHERE account_id = accounts.id) as current_users,
      max_users
      FROM accounts
    `;
    
    res.json({ accounts });
  } catch (error) {
    logger.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Error al obtener las cuentas' });
  }
};

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { service, credentials, maxUsers } = req.body;
    
    const [account] = await sql`
      INSERT INTO accounts (service, credentials, max_users, status)
      VALUES (${service}, ${JSON.stringify(credentials)}, ${maxUsers}, 'active')
      RETURNING id, service, max_users, status
    `;
    
    res.status(201).json(account);
  } catch (error) {
    logger.error('Error creating account:', error);
    res.status(500).json({ error: 'Error al crear la cuenta' });
  }
};