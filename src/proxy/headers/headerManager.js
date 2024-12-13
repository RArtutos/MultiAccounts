export class HeaderManager {
  constructor() {
    this.defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': '*/*',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
  }

  setHeaders(proxyReq, req) {
    try {
      // Solo establecer headers si no han sido enviados
      if (!proxyReq.headersSent) {
        // Establecer headers por defecto solo si no existen
        Object.entries(this.defaultHeaders).forEach(([key, value]) => {
          if (!proxyReq.getHeader(key)) {
            try {
              proxyReq.setHeader(key, value);
            } catch (error) {
              // Ignorar errores de headers individuales
              console.warn(`No se pudo establecer el header ${key}:`, error.message);
            }
          }
        });

        // Establecer headers de forwarding
        try {
          proxyReq.setHeader('x-forwarded-for', req.ip);
          proxyReq.setHeader('x-forwarded-proto', req.protocol);
          proxyReq.setHeader('x-forwarded-host', req.get('host'));
        } catch (error) {
          console.warn('No se pudieron establecer los headers de forwarding:', error.message);
        }
      }
    } catch (error) {
      console.error('Error estableciendo headers:', error);
      // No lanzar el error, solo registrarlo
    }
  }
}