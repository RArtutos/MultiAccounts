import express from 'express';
import { remoteBrowserMiddleware } from '../middleware/remoteBrowser.js';
import * as accountService from '../services/accountService.js';

const router = express.Router();

async function setupProxy(req, res, next) {
  try {
    // Extract account name from subdomain
    const host = req.get('host');
    if (!host) {
      return res.status(400).send('Invalid host');
    }

    const accountName = host.split('.')[0];
    if (!accountName) {
      return res.status(400).send('Invalid subdomain');
    }

    // Get account details
    const { accounts } = await accountService.getAccounts();
    const account = accounts.find(acc => acc.name === accountName);
    if (!account) {
      return res.status(404).send('Account not found');
    }

    // Attach account to request
    req.streamingAccount = account;

    // Handle request with remote browser
    return remoteBrowserMiddleware(req, res, next);
  } catch (error) {
    console.error('Proxy setup error:', error);
    if (!res.headersSent) {
      res.status(500).send('Internal server error');
    }
  }
}

router.all('*', setupProxy);

export { router as proxyRouter };