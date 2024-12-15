import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { CookieManager } from '../cookies/cookieManager.js';
import { HeaderManager } from '../headers/headerManager.js';
import { getDefaultHeaders } from './headers.js';

const PROXY_CONFIG = {
  http: process.env.HTTP_PROXY,
  https: process.env.HTTPS_PROXY,
  socks5: process.env.SOCKS_PROXY
};

export function createProxyConfig(account, req, targetDomain) {
  const cookieManager = new CookieManager(account);
  const headerManager = new HeaderManager();
  const headers = getDefaultHeaders(req.headers['user-agent']);
  
  // Obtener cookies del usuario actual
  const userCookies = cookieManager.parseCookieHeader(req.headers.cookie);
  const cookieString = cookieManager.getCookieString(userCookies);

  // Crear agentes de proxy si están configurados
  const proxyAgent = PROXY_CONFIG.https ? new HttpsProxyAgent(PROXY_CONFIG.https) : null;
  const socksAgent = PROXY_CONFIG.socks5 ? new SocksProxyAgent(PROXY_CONFIG.socks5) : null;

  return {
    target: account.url,
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    autoRewrite: true,
    ws: true,
    xfwd: true,
    agent: proxyAgent || socksAgent,
    cookieDomainRewrite: {
      '*': req.get('host')
    },
    cookiePathRewrite: {
      '*': '/'
    },
    preserveHeaderKeyCase: true,
    timeout: 60000,
    proxyTimeout: 60000,
    // Configuración mejorada para WebSocket
    wsOptions: {
      maxPayload: 128 * 1024 * 1024, // 128MB
      perMessageDeflate: {
        zlibDeflateOptions: { chunkSize: 1024, memLevel: 7, level: 3 },
        zlibInflateOptions: { chunkSize: 10 * 1024 },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 10,
        threshold: 1024
      }
    },
    headers: {
      ...headers,
      'Cookie': cookieString,
      'Origin': account.url,
      'Referer': account.url,
      'Host': targetDomain
    },
    onProxyReq: (proxyReq, req) => {
      try {
        // Asegurar que tenemos el host correcto
        proxyReq.setHeader('Host', targetDomain);

        // Manejar datos POST
        if (req.method === 'POST' && req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }

        // Manejar encabezados CORS para solicitudes AJAX
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
          proxyReq.setHeader('Access-Control-Allow-Origin', '*');
          proxyReq.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
          proxyReq.setHeader('Access-Control-Allow-Headers', '*');
          proxyReq.setHeader('Access-Control-Allow-Credentials', 'true');
        }

        // Log para debugging
        console.log('Proxy Request Headers:', proxyReq.getHeaders());
      } catch (error) {
        console.error('Error in onProxyReq:', error);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      try {
        // Eliminar encabezados de seguridad restrictivos
        const headersToRemove = [
          'content-security-policy',
          'x-frame-options',
          'x-content-type-options',
          'x-xss-protection',
          'strict-transport-security'
        ];

        headersToRemove.forEach(header => {
          delete proxyRes.headers[header.toLowerCase()];
        });

        // Manejar cookies de respuesta
        if (proxyRes.headers['set-cookie']) {
          const newCookies = cookieManager.handleResponseCookies(proxyRes.headers['set-cookie']);
          
          // Actualizar cookies de la cuenta
          cookieManager.updateAccountCookies(newCookies);

          // Reescribir las cookies para el dominio del proxy
          proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(cookie => {
            return cookie
              .replace(/Domain=[^;]+/, `Domain=${req.get('host')}`)
              .replace(/Path=[^;]+/, 'Path=/');
          });
        }

        // Manejar redirecciones
        if (proxyRes.headers.location) {
          const location = proxyRes.headers.location;
          if (location.startsWith('http')) {
            try {
              const url = new URL(location);
              if (url.hostname === targetDomain) {
                proxyRes.headers.location = `https://${req.get('host')}${url.pathname}${url.search}`;
              }
            } catch (error) {
              console.error('Error handling redirect:', error);
            }
          }
        }

        // Configurar encabezados CORS para respuestas AJAX
        if (req.headers['x-requested-with'] === 'XMLHttpRequest') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
          res.setHeader('Access-Control-Allow-Headers', '*');
          res.setHeader('Access-Control-Allow-Credentials', 'true');
        }

        // Log para debugging
        console.log('Proxy Response Headers:', proxyRes.headers);
      } catch (error) {
        console.error('Error in onProxyRes:', error);
      }
    },
    onProxyReqWs: (proxyReq, req, socket) => {
      try {
        // Configurar encabezados WebSocket
        proxyReq.setHeader('Origin', account.url);
        proxyReq.setHeader('Sec-WebSocket-Protocol', req.headers['sec-websocket-protocol'] || '');

        socket.on('error', (err) => {
          console.error('WebSocket error:', err);
        });
      } catch (error) {
        console.error('Error in onProxyReqWs:', error);
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Proxy error');
      }
    }
  };
}