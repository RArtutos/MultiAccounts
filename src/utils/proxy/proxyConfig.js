import { ProxyManager } from './proxyManager.js';
import { CookieHandler } from './cookieHandler.js';
import { HeaderHandler } from './handlers/headerHandler.js';

const proxyManager = new ProxyManager();

export function createProxyConfig(account, req, targetDomain) {
  const cookieHandler = new CookieHandler(account);
  const headerHandler = new HeaderHandler(targetDomain);

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

    // Handle outgoing request
    onProxyReq: function(proxyReq, req, res) {
      // Don't modify headers if they're already sent
      if (proxyReq._headerSent) return;

      try {
        // Copy original headers first
        const originalHeaders = {
          'user-agent': req.headers['user-agent'],
          'accept': req.headers['accept'],
          'accept-language': req.headers['accept-language'],
          'accept-encoding': req.headers['accept-encoding'],
          'cache-control': req.headers['cache-control'],
          'pragma': req.headers['pragma'],
          'cookie': req.headers['cookie']
        };

        // Set headers in a specific order
        const orderedHeaders = {
          ...originalHeaders,
          'host': targetDomain,
          'x-forwarded-for': req.ip,
          'x-forwarded-proto': req.protocol,
          'x-real-ip': req.ip
        };

        // Set headers
        Object.entries(orderedHeaders).forEach(([key, value]) => {
          if (value) {
            proxyReq.setHeader(key, value);
          }
        });

        // Handle cookies last
        const accountCookies = cookieHandler.getAccountCookies();
        if (accountCookies) {
          const existingCookies = proxyReq.getHeader('cookie') || '';
          const allCookies = existingCookies ? 
            `${existingCookies}; ${accountCookies}` : 
            accountCookies;
          proxyReq.setHeader('cookie', allCookies);
        }

      } catch (error) {
        console.error('Error in onProxyReq:', error);
      }
    },

    // Handle incoming response
    onProxyRes: function(proxyRes, req, res) {
      try {
        // Remove security headers that might interfere
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

        // Handle Set-Cookie headers
        const setCookieHeader = proxyRes.headers['set-cookie'];
        if (Array.isArray(setCookieHeader)) {
          const transformedCookies = cookieHandler.transformCookies(setCookieHeader);
          if (transformedCookies.length > 0) {
            proxyRes.headers['set-cookie'] = transformedCookies;
          }
        }

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