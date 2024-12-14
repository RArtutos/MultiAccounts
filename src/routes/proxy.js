import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { createProxyConfig } from '../utils/proxy/config/proxyConfig.js';
import { getServiceDomain } from '../utils/urlUtils.js';
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

    // Get target domain
    const targetDomain = getServiceDomain(account.url);
    if (!targetDomain) {
      return res.status(400).send('Invalid target URL');
    }

    // Create and apply proxy
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