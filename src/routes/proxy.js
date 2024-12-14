import express from 'express';
import { VelocityService } from '../services/velocityService.js';
import * as accountService from '../services/accountService.js';

const router = express.Router();

router.use('/:accountName/*', async (req, res, next) => {
  try {
    const { accountName } = req.params;
    const { accounts } = await accountService.getAccounts();
    const account = accounts.find(acc => acc.name === accountName);

    if (!account) {
      return res.status(404).send('Account not found');
    }

    if (account.status !== 'Available') {
      return res.status(403).send('Account not available');
    }

    const velocityService = new VelocityService(account);
    const proxyInstance = await velocityService.createProxyInstance();
    
    // Store the proxy instance in the request for later use
    req.velocityProxy = proxyInstance;
    next();
  } catch (error) {
    console.error('Error in proxy middleware:', error);
    next(error);
  }
});

export { router as proxyRouter };