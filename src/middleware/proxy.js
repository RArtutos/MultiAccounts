import { createProxyMiddleware } from 'http-proxy-middleware';
import { getAccounts } from '../services/accountService.js';

export async function createStreamingProxy(req, res, next) {
  const platform = req.params.platform;
  const { accounts } = await getAccounts();
  
  // Find an available account for the requested platform
  const account = accounts.find(acc => 
    acc.url.includes(platform) && acc.status === 'Available'
  );

  if (!account) {
    return res.status(404).send('No available accounts for this platform');
  }

  // Create proxy middleware for the specific streaming service
  const proxy = createProxyMiddleware({
    target: account.url,
    changeOrigin: true,
    secure: true,
    onProxyReq: (proxyReq, req, res) => {
      // Add account cookies to the request
      if (account.cookies) {
        const cookieString = Object.entries(account.cookies)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ');
        if (cookieString) {
          proxyReq.setHeader('Cookie', cookieString);
        }
      }
      proxyReq.setHeader('X-Forwarded-For', req.ip);
    },
    onProxyRes: async (proxyRes, req, res) => {
      console.log(`Proxied request to ${account.url}`);
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).send('Proxy error occurred');
    }
  });

  return proxy(req, res, next);
}