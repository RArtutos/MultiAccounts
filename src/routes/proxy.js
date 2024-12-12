import express from 'express';
import { createStreamingProxy } from '../middleware/proxy.js';
import * as accountService from '../services/accountService.js';
import { getServiceDomain } from '../utils/urlUtils.js';

const router = express.Router();

// Manejar tanto el formato actual como el nuevo formato de URLs
router.all([
  '/stream/:accountName/*',
  '/stream/:accountName/*/https://*',
  '/stream/:accountName/*/http://*'
], async (req, res, next) => {
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

    // Extraer la URL original si está en el nuevo formato
    const path = req.path;
    const matches = path.match(/\/stream\/[^/]+\/(.+)/);
    if (matches) {
      const originalPath = matches[1];
      if (originalPath.startsWith('http://') || originalPath.startsWith('https://')) {
        account.url = originalPath;
      }
    }

    req.streamingAccount = account;
    return createStreamingProxy(req, res, next);
  } catch (error) {
    console.error('Error de streaming:', error);
    if (!res.headersSent) {
      res.status(500).send('Error accediendo al servicio de streaming');
    }
  }
});

export { router as proxyRouter };