import express from 'express';
import { createStreamingProxy } from '../middleware/proxy.js';
import * as accountService from '../services/accountService.js';

const router = express.Router();

// Proxy route for streaming services with account name
router.all('/stream/:accountName/*', async (req, res, next) => {
  try {
    const { accountName } = req.params;
    const { accounts } = await accountService.getAccounts();
    
    // Find the specific account
    const account = accounts.find(acc => acc.name === decodeURIComponent(accountName));
    
    if (!account) {
      return res.status(404).send('Account not found');
    }
    
    if (account.status !== 'Available') {
      return res.status(403).send('Account is currently in use');
    }

    // Add account to request for proxy middleware
    req.streamingAccount = account;
    
    // Handle the proxy request
    return createStreamingProxy(req, res, next);
  } catch (error) {
    console.error('Streaming error:', error);
    if (!res.headersSent) {
      res.status(500).send('Error accessing streaming service');
    }
  }
});

export { router as proxyRouter };