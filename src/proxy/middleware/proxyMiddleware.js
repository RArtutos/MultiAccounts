import { createProxyMiddleware } from 'http-proxy-middleware';
import { CookieManager } from '../cookies/cookieManager.js';
import { HeaderManager } from '../headers/headerManager.js';
import { ResponseHandler } from '../handlers/responseHandler.js';
import { UrlRewriter } from '../url/urlRewriter.js';

export class ProxyMiddleware {
  constructor() {
    this.cookieManager = new CookieManager();
    this.headerManager = new HeaderManager();
    this.responseHandler = new ResponseHandler();
    this.urlRewriter = new UrlRewriter();
  }

  create(account, targetDomain) {
    const proxyConfig = {
      target: account.url,
      changeOrigin: true,
      secure: true,
      followRedirects: true,
      ws: true,
      xfwd: true,
      cookieDomainRewrite: {
        '*': targetDomain
      },

      onProxyReq: (proxyReq, req) => {
        try {
          // Verificar si los headers ya fueron enviados
          if (!proxyReq.headersSent) {
            // Establecer headers primero
            this.headerManager.setHeaders(proxyReq, req);
            
            // Luego establecer cookies
            this.cookieManager.setCookies(proxyReq, account);
            
            // Establecer el host header para que coincida con el target
            proxyReq.setHeader('host', targetDomain);
          }
        } catch (error) {
          console.error('Error en onProxyReq:', error);
        }
      },

      onProxyRes: (proxyRes, req, res) => {
        try {
          // Solo procesar la respuesta si los headers no han sido enviados
          if (!res.headersSent) {
            this.responseHandler.handle(proxyRes, req, res, account, targetDomain);
          } else {
            // Si los headers ya fueron enviados, solo pipe la respuesta
            proxyRes.pipe(res);
          }
        } catch (error) {
          console.error('Error en onProxyRes:', error);
          if (!res.headersSent) {
            res.status(500).send('Error interno del servidor');
          }
        }
      },

      pathRewrite: (path, req) => {
        return this.urlRewriter.rewritePath(path, req, account);
      },

      // Manejar errores del proxy
      onError: (err, req, res) => {
        console.error('Error en el proxy:', err);
        if (!res.headersSent) {
          res.status(502).json({
            error: 'Error en el proxy',
            message: err.message
          });
        }
      }
    };

    return createProxyMiddleware(proxyConfig);
  }
}