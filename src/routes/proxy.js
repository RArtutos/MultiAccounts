import express from 'express';
import { ProxyService } from '../proxy/services/proxyService.js';
import { AccountValidator } from '../services/accountValidator.js';
import * as accountService from '../services/accountService.js';

const router = express.Router();
const proxyService = new ProxyService();
const accountValidator = new AccountValidator(accountService);

// Middleware para extraer el nombre de la cuenta y la ruta original
router.use('/stream/:accountName/*', (req, res, next) => {
  req.originalPath = req.url.split('/stream/' + req.params.accountName)[1] || '/';
  next();
});

router.all('/stream/:accountName*', accountValidator.validateAccount.bind(accountValidator), (req, res, next) => {
  const proxy = proxyService.createProxyMiddleware(req.streamingAccount, req.targetDomain);
  return proxy(req, res, next);
});

export { router as proxyRouter };