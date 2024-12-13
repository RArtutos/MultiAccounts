import { StaticHandler } from './static/staticHandler.js';
import { PathHandler } from './path/pathHandler.js';
import { HeaderManager } from './headers/headerManager.js';
import { CookieManager } from './cookies/cookieManager.js';

const staticHandler = new StaticHandler();

export function createProxyConfig(account, req, targetDomain) {
  const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  const pathHandler = new PathHandler(accountPrefix);
  const userAgent = req.headers['user-agent'];

  return {
    target: account.url,
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    autoRewrite: true,
    ws: true,
    xfwd: true,
    cookieDomainRewrite: {
      '*': req.get('host')
    },
    pathRewrite: (path) => {
      const isStatic = staticHandler.isStaticResource(path);
      return pathHandler.rewritePath(path, isStatic);
    },
    onProxyReq: (proxyReq, req, res) => {
      try {
        // Configurar headers
        const headerManager = new HeaderManager(proxyReq, userAgent);
        headerManager.setHeaders();

        // Configurar cookies
        const cookieManager = new CookieManager(proxyReq, account);
        cookieManager.setCookies();

        // Asegurar que el host sea el correcto
        proxyReq.setHeader('host', targetDomain);

        // Mantener la IP original
        const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (clientIp) {
          proxyReq.setHeader('x-forwarded-for', clientIp);
        }
      } catch (error) {
        console.error('Error in onProxyReq:', error);
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error de proxy: ' + err.message);
      }
    }
  };
}