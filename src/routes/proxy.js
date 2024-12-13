import express from 'express';
import { remoteBrowserMiddleware } from '../middleware/remoteBrowser.js';
import * as accountService from '../services/accountService.js';

const router = express.Router();

async function setupProxy(req, res, next) {
  try {
    // Extraer nombre de cuenta del subdominio
    const host = req.get('host');
    if (!host) {
      return res.status(400).send('Invalid host');
    }

    const accountName = host.split('.')[0];
    if (!accountName) {
      return res.status(400).send('Invalid subdomain');
    }

    // Obtener detalles de la cuenta
    const { accounts } = await accountService.getAccounts();
    const account = accounts.find(acc => acc.name === accountName);
    if (!account) {
      return res.status(404).send('Account not found');
    }

    // Adjuntar cuenta a la request
    req.streamingAccount = account;
    next();
  } catch (error) {
    console.error('Proxy setup error:', error);
    next(error);
  }
}

router.all('*', setupProxy, remoteBrowserMiddleware);

export { router as proxyRouter };