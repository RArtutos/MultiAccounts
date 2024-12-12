export class ResponseHandler {
  handle(proxyRes, req, res, account) {
    if (res.headersSent) {
      return;
    }

    // Copiar headers seguros
    Object.keys(proxyRes.headers).forEach(key => {
      const lowerKey = key.toLowerCase();
      // No copiar headers que puedan causar problemas
      if (!['content-length', 'transfer-encoding', 'content-encoding'].includes(lowerKey)) {
        try {
          res.setHeader(key, proxyRes.headers[key]);
        } catch (error) {
          console.warn(`Could not set header ${key}:`, error.message);
        }
      }
    });

    // Manejar redirecciones
    if (proxyRes.headers.location) {
      const location = proxyRes.headers.location;
      // Si es una URL absoluta al mismo dominio, mantener el prefijo /stream/accountName
      if (location.startsWith('http')) {
        try {
          const locationUrl = new URL(location);
          const targetUrl = new URL(account.url);
          if (locationUrl.hostname === targetUrl.hostname) {
            res.setHeader('location', `/stream/${encodeURIComponent(account.name)}${locationUrl.pathname}${locationUrl.search}${locationUrl.hash}`);
          } else {
            res.setHeader('location', location);
          }
        } catch (error) {
          console.error('Error handling redirect:', error);
          res.setHeader('location', location);
        }
      }
    }

    // Pipe la respuesta
    proxyRes.pipe(res);
  }
}