import express from 'express';
import { createStreamingProxy } from '../middleware/proxy.js';
import * as accountService from '../services/accountService.js';
import { config } from '../config/index.js';
import { SubdomainExtractor } from '../utils/domain/subdomainExtractor.js';

const router = express.Router();
const subdomainExtractor = new SubdomainExtractor(config.domain.base);

// Middleware para validar y preparar la cuenta basado en el subdominio
async function validateAccount(req, res, next) {
  try {
    const host = req.get('host');
    if (!host || host === config.domain.base) {
      return next();
    }

    const accountName = subdomainExtractor.extract(host);
    if (!accountName) {
      return res.status(404).send('Subdominio inválido');
    }

    const { accounts } = await accountService.getAccounts();
    const account = accounts.find(acc => acc.name === accountName);
    
    if (!account) {
      return res.status(404).send('Cuenta no encontrada');
    }

    req.streamingAccount = account;
    next();
  } catch (error) {
    console.error('Error validando cuenta:', error);
    res.status(500).send('Error interno del servidor');
  }
}

// Ruta para el proxy usando subdominio
router.all('*', validateAccount, createStreamingProxy);

export { router as proxyRouter };