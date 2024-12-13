import express from 'express';
import { ProxyMiddleware } from '../proxy/middleware/proxyMiddleware.js';
import { AccountValidator } from '../services/accountValidator.js';
import * as accountService from '../services/accountService.js';

const router = express.Router();
const proxyMiddleware = new ProxyMiddleware();
const accountValidator = new AccountValidator(accountService);

// Extract account name and original path
router.use('/stream/:accountName/*', (req, res, next) => {
  const fullPath = req.url;
  const accountNameMatch = fullPath.match(/\/stream\/([^/]+)(.*)/);
  if (accountNameMatch) {
    req.originalPath = accountNameMatch[2] || '/';
    req.accountName = decodeURIComponent(accountNameMatch[1]);
  }
  next();
});

// Main proxy route
router.all('/stream/:accountName*', accountValidator.validateAccount.bind(accountValidator), (req, res, next) => {
  try {
    const proxy = proxyMiddleware.create(req.streamingAccount, req.targetDomain);
    return proxy(req, res, next);
  } catch (error) {
    console.error('Error creating proxy:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Proxy Error',
        message: 'Error creating proxy middleware'
      });
    }
  }
});

export { router as proxyRouter };