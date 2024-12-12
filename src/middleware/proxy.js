import { createProxyMiddleware } from 'http-proxy-middleware';
import { createProxyConfig } from '../utils/proxyConfig.js';
import { handleProxyResponse } from '../utils/proxyResponse.js';
import { getServiceDomain } from '../utils/urlUtils.js';

export async function createStreamingProxy(req, res, next) {
  const account = req.streamingAccount;
  const targetDomain = getServiceDomain(account.url);
  const proxyConfig = createProxyConfig(account, req, targetDomain);
  
  // Create proxy middleware
  const proxy = createProxyMiddleware({
    ...proxyConfig,
    onProxyRes: (proxyRes, req, res) => handleProxyResponse(proxyRes, req, res, account, targetDomain),
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.status(500).send('Proxy error occurred');
      }
    }
  });

  return proxy(req, res, next);
}