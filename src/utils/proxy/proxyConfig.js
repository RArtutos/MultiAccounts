import { CookieHandler } from './handlers/cookieHandler.js';
import { HeaderHandler } from './handlers/headerHandler.js';
import { ProxyManager } from './proxyManager.js';

const proxyManager = new ProxyManager();

export function createProxyConfig(account, req, targetDomain) {
  const cookieHandler = new CookieHandler(account, targetDomain);
  const headerHandler = new HeaderHandler(targetDomain);

  return {
    target: account.url,
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    ws: true,
    xfwd: true,
    agent: proxyManager.getAgent(),

    onProxyReq: (proxyReq, req, res) => {
      try {
        // Primero manejar las cookies antes que otros headers
        cookieHandler.handleRequest(proxyReq, req);
        
        // Luego configurar los headers restantes
        if (!proxyReq._headerSent) {
          headerHandler.setHeaders(proxyReq, req);
        }
      } catch (error) {
        console.error('Error in onProxyReq:', error);
      }
    },

    onProxyRes: (proxyRes, req, res) => {
      try {
        // Eliminar headers problemáticos primero
        headerHandler.removeProblematicHeaders(proxyRes.headers);
        
        // Luego manejar las cookies de respuesta
        cookieHandler.handleResponse(proxyRes, req);
      } catch (error) {
        console.error('Error in onProxyRes:', error);
      }
    },

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
    }
  };
}