export class HeaderManager {
  constructor() {
    this.defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
  }

  setHeaders(proxyReq, req) {
    try {
      // Verificar si los headers ya fueron enviados
      if (proxyReq.headersSent) {
        console.warn('Headers already sent, skipping header modification');
        return;
      }

      // Copiar headers originales que queremos mantener
      const originalHeaders = {
        'x-forwarded-for': req.ip,
        'x-forwarded-proto': req.protocol,
        'x-forwarded-host': req.get('host')
      };

      // Establecer headers por defecto solo si no existen
      Object.entries(this.defaultHeaders).forEach(([key, value]) => {
        if (!proxyReq.getHeader(key)) {
          try {
            proxyReq.setHeader(key, value);
          } catch (error) {
            console.warn(`Could not set header ${key}:`, error.message);
          }
        }
      });

      // Establecer headers de forwarding
      Object.entries(originalHeaders).forEach(([key, value]) => {
        if (value) {
          try {
            proxyReq.setHeader(key, value);
          } catch (error) {
            console.warn(`Could not set header ${key}:`, error.message);
          }
        }
      });

    } catch (error) {
      console.error('Error setting headers:', error);
      // No lanzar el error, solo registrarlo para evitar interrumpir el flujo
    }
  }
}