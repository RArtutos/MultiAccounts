import { StaticHandler } from '../static/staticHandler.js';
import { EXCLUDED_HEADERS } from '../config/headers.js';

export class ResponseHandler {
  constructor() {
    this.staticHandler = new StaticHandler();
  }

  handle(proxyRes, req, res) {
    try {
      // Eliminar headers problemáticos
      EXCLUDED_HEADERS.forEach(header => {
        delete proxyRes.headers[header];
      });

      // Copiar headers seguros
      Object.entries(proxyRes.headers).forEach(([key, value]) => {
        if (!res.headersSent && !EXCLUDED_HEADERS.includes(key.toLowerCase())) {
          res.setHeader(key, value);
        }
      });

      // Establecer headers de caché
      if (!res.headersSent) {
        if (this.staticHandler.isStaticResource(req.url)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000');
        } else {
          res.setHeader('Cache-Control', 'no-store');
        }
      }
    } catch (error) {
      console.error('Error handling response:', error);
    }
  }
}