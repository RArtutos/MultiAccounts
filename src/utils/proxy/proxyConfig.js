import { ProxyManager } from './proxyManager.js';
import { CookieHandler } from './cookieHandler.js';

const proxyManager = new ProxyManager();

export function createProxyConfig(account, req, targetDomain) {
  const cookieHandler = new CookieHandler(account);

  return {
    target: account.url,
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    autoRewrite: true,
    ws: true,
    xfwd: true,
    agent: proxyManager.getAgent(),
    
    cookieDomainRewrite: {
      '*': req.get('host')
    },
    cookiePathRewrite: {
      '*': '/'
    },

    onProxyReq: (proxyReq, req, res) => {
      try {
        // Headers básicos
        proxyReq.setHeader('User-Agent', req.headers['user-agent'] || 'Mozilla/5.0');
        proxyReq.setHeader('Accept', '*/*');
        proxyReq.setHeader('Accept-Language', 'es-MX,es;q=0.9,en;q=0.8');
        proxyReq.setHeader('Accept-Encoding', 'gzip, deflate');
        proxyReq.setHeader('host', targetDomain);
        proxyReq.setHeader('x-forwarded-for', '45.166.110.64');

        // Inyectar cookies de la cuenta
        const headers = cookieHandler.injectAccountCookies(proxyReq.getHeaders());
        Object.entries(headers).forEach(([key, value]) => {
          if (value !== undefined) {
            proxyReq.setHeader(key, value);
          }
        });

      } catch (error) {
        console.error('Error en onProxyReq:', error);
      }
    },

    onProxyRes: (proxyRes, req, res) => {
      // Manejar cookies de respuesta
      const cookies = proxyRes.headers['set-cookie'];
      if (cookies) {
        const transformedCookies = cookieHandler.transformCookies(cookies);
        if (transformedCookies.length > 0) {
          proxyRes.headers['set-cookie'] = transformedCookies;
        }
      }

      // Eliminar headers problemáticos
      const headersToRemove = [
        'content-security-policy',
        'x-frame-options',
        'content-security-policy-report-only',
        'strict-transport-security',
        'x-content-type-options',
        'x-xss-protection'
      ];

      headersToRemove.forEach(header => {
        delete proxyRes.headers[header];
      });
    },

    onError: async (err, req, res) => {
      console.error('Error de proxy:', err);

      if (await proxyManager.switchToFallback()) {
        console.log('Reintentando con proxy alternativo...');
      } else {
        if (!res.headersSent) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error de proxy');
        }
        proxyManager.resetRetryCount();
      }
    }
  };
}