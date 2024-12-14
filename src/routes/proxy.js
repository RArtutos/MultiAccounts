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

    const velocityService = new VelocityService(account);
    const proxyInstance = await velocityService.createProxyInstance();
    
    // Almacenar la instancia de Velocity en la request para uso posterior
    req.velocityProxy = proxyInstance;
    next();
  } catch (error) {
    next(error);
  }
});

export { router as proxyRouter };