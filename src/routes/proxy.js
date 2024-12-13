import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createProxyConfig } from '../utils/proxyConfig.js';

const router = express.Router();

function setupProxy(req, res, next) {
  try {
    const account = req.streamingAccount;
    const targetDomain = req.targetDomain;

    if (!account || !targetDomain) {
      return res.status(400).send('Invalid proxy configuration');
    }

    const proxy = createProxyMiddleware(createProxyConfig(account, req, targetDomain));
    return proxy(req, res, next);
  } catch (error) {
    console.error('Proxy setup error:', error);
    if (!res.headersSent) {
      res.status(500).send('Internal server error');
    }
  }
}

router.all('*', setupProxy);

export { router as proxyRouter };