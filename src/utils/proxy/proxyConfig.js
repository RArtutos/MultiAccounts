import { ProxyManager } from './proxyManager.js';

const proxyManager = new ProxyManager();

export function createProxyConfig(account, req, targetDomain) {
  return {
    target: account.url,
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    autoRewrite: true,
    ws: true,
    xfwd: true,
    agent: proxyManager.getAgent(),
    onProxyReq: (proxyReq, req, res) => {
      try {
        // Headers básicos
        proxyReq.setHeader('User-Agent', req.headers['user-agent'] || 'Mozilla/5.0');
        proxyReq.setHeader('Accept', '*/*');
        proxyReq.setHeader('Accept-Language', 'es-MX,es;q=0.9,en;q=0.8');
        proxyReq.setHeader('Accept-Encoding', 'gzip, deflate');

        // Cookies de la cuenta si existen
        if (account.cookies) {
          const cookieString = Object.entries(account.cookies)
            .map(([name, value]) => `${name}=${value}`)
            .join('; ');
          
          if (cookieString) {
            proxyReq.setHeader('cookie', cookieString);
          }
        }

      } catch (error) {
        console.error('Error en onProxyReq:', error);
      }
    },
    onError: async (err, req, res) => {
      console.error('Error de proxy:', err);

      // Intentar cambiar de proxy si hay error
      if (await proxyManager.switchToFallback()) {
        console.log('Reintentando con proxy alternativo...');
        // La petición se reintentará automáticamente con el nuevo agente
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