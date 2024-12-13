import { CookieManager } from '../utils/cookies/CookieManager.js';
import { CookieDebugger } from '../utils/cookies/CookieDebugger.js';

export function cookieMiddleware(account) {
  const cookieManager = new CookieManager(account);

  return {
    onProxyReq: (proxyReq, req) => {
      if (!proxyReq._headerSent) {
        try {
          CookieDebugger.logCookie('Request Start', {
            url: req.url,
            method: req.method,
            headers: req.headers
          });

          // Manejar cookies entrantes
          const incomingCookies = req.headers.cookie;
          cookieManager.handleIncomingCookies(incomingCookies);

          // Establecer cookies en la petición saliente
          const outgoingCookies = cookieManager.handleOutgoingCookies();
          if (outgoingCookies) {
            proxyReq.setHeader('cookie', outgoingCookies);
            CookieDebugger.logCookie('Proxy Request Headers Set', {
              cookies: outgoingCookies
            });
          }

          // Log final headers
          CookieDebugger.logCookie('Final Request Headers', {
            headers: proxyReq.getHeaders()
          });
        } catch (error) {
          CookieDebugger.logError('onProxyReq', error);
        }
      }
    },

    onProxyRes: (proxyRes, req) => {
      try {
        CookieDebugger.logCookie('Response Start', {
          url: req.url,
          status: proxyRes.statusCode,
          headers: proxyRes.headers
        });

        // Manejar Set-Cookie headers
        const setCookieHeaders = proxyRes.headers['set-cookie'];
        if (setCookieHeaders) {
          const transformedHeaders = cookieManager.handleSetCookieHeaders(setCookieHeaders);
          if (transformedHeaders.length > 0) {
            proxyRes.headers['set-cookie'] = transformedHeaders;
            CookieDebugger.logCookie('Set-Cookie Headers Modified', {
              original: setCookieHeaders,
              transformed: transformedHeaders
            });
          }
        }

        // Log final headers
        CookieDebugger.logCookie('Final Response Headers', {
          headers: proxyRes.headers
        });
      } catch (error) {
        CookieDebugger.logError('onProxyRes', error);
      }
    }
  };
}