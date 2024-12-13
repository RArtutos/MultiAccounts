import { ProxyManager } from './proxyManager.js';
import { HeaderHandler } from './handlers/headerHandler.js';
import { cookieMiddleware } from '../../middleware/cookieMiddleware.js';

const proxyManager = new ProxyManager();

export function createProxyConfig(account, req, targetDomain) {
  const headerHandler = new HeaderHandler(targetDomain);
  const cookieHandler = cookieMiddleware(account);

  return {
    target: account.url,
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    autoRewrite: true,
    ws: true,
    xfwd: true,
    agent: proxyManager.getAgent(),
    
    // Cookie handling
    cookieDomainRewrite: {
      '*': req.get('host')
    },
    cookiePathRewrite: {
      '*': '/'
    },

    // Request handling
    onProxyReq: (proxyReq, req, res) => {
      if (proxyReq._headerSent) return;

      try {
        // Set headers
        const headers = headerHandler.getDefaultHeaders(req.headers['user-agent']);
        Object.entries(headers).forEach(([key, value]) => {
          if (value) {
            proxyReq.setHeader(key, value);
          }
        });

        // Handle cookies
        cookieHandler.onProxyReq(proxyReq, req);
      } catch (error) {
        console.error('Error in onProxyReq:', error);
      }
    },

    // Response handling
    onProxyRes: (proxyRes, req, res) => {
      try {
        // Remove security headers
        const removeHeaders = [
          'x-frame-options',
          'content-security-policy',
          'content-security-policy-report-only',
          'strict-transport-security',
          'x-content-type-options',
          'x-xss-protection'
        ];

        removeHeaders.forEach(header => {
          delete proxyRes.headers[header];
        });

        // Handle cookies
        cookieHandler.onProxyRes(proxyRes, req);
      } catch (error) {
        console.error('Error in onProxyRes:', error);
      }
    },

    // Error handling
    onError: async (err, req, res) => {
      console.error('Proxy error:', err);

      if (await proxyManager.switchToFallback()) {
        console.log('Retrying with fallback proxy...');
        return;
      }

      if (!res.headersSent) {
        res.writeHead(500, {
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end('Proxy error');
      }
      proxyManager.resetRetryCount();
    }
  };
}