import express from 'express';
import { createStreamingProxy } from '../middleware/proxy.js';
import * as accountService from '../services/accountService.js';

const router = express.Router();

// Middleware para validar y preparar la cuenta
async function validateAccount(req, res, next) {
  try {
    const { accountName } = req.params;
    const { accounts } = await accountService.getAccounts();
    const account = accounts.find(acc => acc.name === decodeURIComponent(accountName));
    
    if (!account) {
      return res.status(404).send('Cuenta no encontrada');
    }
    
    if (account.status !== 'Available') {
      return res.status(403).send('La cuenta está actualmente en uso');
    }

    req.streamingAccount = account;
    next();
  } catch (error) {
    console.error('Error validando cuenta:', error);
    res.status(500).send('Error interno del servidor');
  }
}

// Ruta principal para el streaming
router.all('/stream/:accountName*', validateAccount, createStreamingProxy);

export { router as proxyRouter };