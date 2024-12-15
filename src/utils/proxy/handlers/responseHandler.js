import { CookieManager } from '../cookies/cookieManager.js';

export class ResponseHandler {
  constructor(account) {
    this.account = account;
    this.cookieManager = new CookieManager(account);
  }

  handleResponse(proxyRes, req, res) {
    // No modificar headers si ya fueron enviados
    if (res.headersSent) {
      return;
    }

    try {
      // Headers a excluir
      const excludedHeaders = [
        'content-length',
        'transfer-encoding',
        'content-security-policy',
        'x-frame-options',
        'strict-transport-security'
      ];

      // Copiar headers necesarios
      Object.entries(proxyRes.headers).forEach(([key, value]) => {
        const headerKey = key.toLowerCase();
        if (!excludedHeaders.includes(headerKey) && value !== undefined && value !== null) {
          try {
            res.setHeader(key, value);
          } catch (e) {
            // Ignorar errores de headers
          }
        }
      });

      // Manejar cookies
      if (proxyRes.headers['set-cookie']) {
        try {
          const newCookies = this.cookieManager.handleResponseCookies(proxyRes.headers['set-cookie']);
          this.cookieManager.updateAccountCookies(newCookies);

          const transformedCookies = proxyRes.headers['set-cookie'].map(cookie => {
            return cookie
              .replace(/Domain=[^;]+/, `Domain=${req.get('host')}`)
              .replace(/Path=[^;]+/, 'Path=/');
          });

          res.setHeader('set-cookie', transformedCookies);
        } catch (e) {
          console.error('Error handling cookies:', e);
        }
      }

      // Manejar redirecciones
      if (proxyRes.headers.location) {
        try {
          const location = proxyRes.headers.location;
          if (location.startsWith('http')) {
            const url = new URL(location);
            const newLocation = `https://${req.get('host')}${url.pathname}${url.search}`;
            res.setHeader('location', newLocation);
          }
        } catch (e) {
          console.error('Error handling redirect:', e);
        }
      }

      // Establecer CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
    } catch (error) {
      console.error('Error handling response:', error);
    }
  }
}