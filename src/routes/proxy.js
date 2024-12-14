import express from 'express';
import * as accountService from '../services/accountService.js';
import { velocityMiddleware } from '../velocity/index.js';
import { getVelocityDistPath } from '../velocity/utils/pathUtils.js';
import path from 'path';

const router = express.Router();

// Middleware para procesar subdominios
router.use(async (req, res, next) => {
  try {
    const host = req.get('host');
    const accountName = host.split('.')[0];
    
    if (!accountName) {
      return res.status(400).send('Invalid subdomain');
    }

    const { accounts } = await accountService.getAccounts();
    const account = accounts.find(acc => acc.name === accountName);

    if (!account) {
      return res.status(404).send('Account not found');
    }

    if (account.status !== 'Available') {
      return res.status(403).send('Account not available');
    }

    req.streamingAccount = account;
    next();
  } catch (error) {
    console.error('Error in proxy middleware:', error);
    next(error);
  }
});

// Servir archivos estáticos de Velocity
router.use('/velocity', express.static(getVelocityDistPath()));

// Usar el middleware de Velocity para todas las rutas
router.use(velocityMiddleware);

export { router as proxyRouter };