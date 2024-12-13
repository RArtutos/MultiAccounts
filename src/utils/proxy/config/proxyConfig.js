import { ProxyManager } from '../proxyManager.js';
import { CookieHandler } from '../handlers/cookieHandler.js';
import { HeaderHandler } from '../handlers/headerHandler.js';

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
    
    cookieDomainRewrite: {
      '*': req.get('host')
    },
    cookiePathRewrite: {
      '*': '/'
    },

    // Configurar headers antes de que se envíe la solicitud
    onProxyReq: (proxyReq, req, res) => {
      if (!proxyReq._headerSent) {
        try {
          // Establecer headers básicos primero
          const headers = headerHandler.getDefaultHeaders(req.headers['user-agent']);
          Object.entries(headers).forEach(([key, value]) => {
            try {
              proxyReq.setHeader(key, value);
            } catch (error) {
              console.warn(`Warning: Could not set header ${key}:`, error.message);
            }
          });

          // Luego intentar inyectar cookies
          const cookieString = cookieHandler.getAccountCookies();
          if (cookieString) {
            try {
              const existingCookies = proxyReq.getHeader('cookie') || '';
              const finalCookies = existingCookies ? 
                `${existingCookies}; ${cookieString}` : 
                cookieString;
              proxyReq.setHeader('cookie', finalCookies);
            } catch (error) {
              console.warn('Warning: Could not set cookies:', error.message);
            }
          }
        } catch (error) {
          console.warn('Warning in onProxyReq:', error.message);
        }
      }
    },

    // Manejar la respuesta del proxy
    onProxyRes: (proxyRes, req, res) => {
      try {
        // Manejar cookies de respuesta
        const setCookieHeader = proxyRes.headers['set-cookie'];
        if (Array.isArray(setCookieHeader)) {
          const transformedCookies = cookieHandler.transformCookies(setCookieHeader);
          if (transformedCookies.length > 0) {
            proxyRes.headers['set-cookie'] = transformedCookies;
          }
        }

        // Eliminar headers problemáticos
        headerHandler.removeProblematicHeaders(proxyRes.headers);

        // Asegurar que Content-Type esté establecido
        if (!proxyRes.headers['content-type']) {
          proxyRes.headers['content-type'] = 'text/html; charset=utf-8';
        }
      } catch (error) {
        console.warn('Warning in onProxyRes:', error.message);
      }
    },

    // Manejar errores del proxy
    onError: async (err, req, res) => {
      console.error('Error de proxy:', err);

      if (await proxyManager.switchToFallback()) {
        console.log('Reintentando con proxy alternativo...');
        return;
      }

      if (!res.headersSent) {
        res.writeHead(500, { 
          'Content-Type': 'text/plain',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end('Error de proxy');
      }
      proxyManager.resetRetryCount();
    }
  };
}