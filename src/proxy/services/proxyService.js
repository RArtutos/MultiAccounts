import { createProxyMiddleware } from 'http-proxy-middleware';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { proxyConfig } from '../config/proxyConfig.js';
import { proxyDefaults } from '../config/proxyDefaults.js';
import { cookieService } from './cookieService.js';
import { UrlRewriteService } from './urlRewriteService.js';

export class ProxyService {
  createProxyMiddleware(account, targetDomain) {
    const proxyUrl = `http://${proxyConfig.squid.host}:${proxyConfig.squid.port}`;
    const agent = account.url.startsWith('https:') ? 
      new HttpsProxyAgent(proxyUrl) : 
      new HttpProxyAgent(proxyUrl);

    const urlRewriteService = new UrlRewriteService(account);

    return createProxyMiddleware({
      target: account.url,
      changeOrigin: true,
      secure: true,
      ws: true,
      xfwd: true,
      followRedirects: true,
      agent,
      ...proxyDefaults.timeouts,

      onProxyReq: (proxyReq, req) => {
        try {
          if (!proxyReq.headersSent && proxyReq.setHeader) {
            // Establecer headers base
            Object.entries(proxyDefaults.headers).forEach(([key, value]) => {
              if (!proxyReq.getHeader(key)) {
                proxyReq.setHeader(key, value);
              }
            });

            // Combinar cookies de la cuenta y del dispositivo
            const accountCookies = account.cookies || {};
            const deviceCookies = cookieService.getCookies(account.name);
            const allCookies = { ...accountCookies, ...deviceCookies };

            if (Object.keys(allCookies).length > 0) {
              const cookieString = cookieService.serializeCookies(allCookies);
              proxyReq.setHeader('cookie', cookieString);
            }

            // Establecer host original
            const originalUrl = new URL(account.url);
            proxyReq.setHeader('host', originalUrl.host);
          }
        } catch (error) {
          console.warn('Error setting proxy headers:', error.message);
        }
      },

      onProxyRes: async (proxyRes, req, res) => {
        try {
          // Manejar cookies de respuesta
          const setCookieHeaders = proxyRes.headers['set-cookie'];
          if (setCookieHeaders) {
            const cookies = Array.isArray(setCookieHeaders) ? 
              setCookieHeaders.join('; ') : 
              setCookieHeaders;
            
            const parsedCookies = cookieService.parseCookies(cookies);
            await cookieService.storeCookies(account.name, parsedCookies);
          }

          // Reescribir Location header para redirecciones
          if (proxyRes.headers.location) {
            proxyRes.headers.location = urlRewriteService.rewriteUrl(
              proxyRes.headers.location,
              req
            );
          }

          // Copiar headers seguros
          Object.entries(proxyRes.headers)
            .filter(([key]) => !['content-length', 'transfer-encoding'].includes(key.toLowerCase()))
            .forEach(([key, value]) => {
              try {
                res.setHeader(key, value);
              } catch (error) {
                console.warn(`Could not set response header ${key}:`, error.message);
              }
            });
        } catch (error) {
          console.error('Error handling proxy response:', error);
        }
      },

      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        if (!res.headersSent) {
          res.writeHead(502, {
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({
            error: 'Proxy Error',
            message: err.message
          }));
        }
      },

      pathRewrite: (path, req) => urlRewriteService.rewritePath(path)
    });
  }
}