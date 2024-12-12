import express from 'express';
import { ProxyService } from '../proxy/services/proxyService.js';
import { AccountValidator } from '../services/accountValidator.js';
import * as accountService from '../services/accountService.js';

const router = express.Router();
const proxyService = new ProxyService();
const accountValidator = new AccountValidator(accountService);

router.all('/stream/:accountName*', accountValidator.validateAccount.bind(accountValidator), (req, res, next) => {
  const proxy = proxyService.createProxyMiddleware(req.streamingAccount, req.targetDomain);
  return proxy(req, res, next);
});

export { router as proxyRouter };