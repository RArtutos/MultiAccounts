import { getDefaultHeaders, EXCLUDED_HEADERS } from './headers.js';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { CookieManager } from '../cookies/cookieManager.js';

const PROXY_CONFIG = {
  http: 'http://arturojkl:HQKxDbtCiC@45.166.110.64:50100',
  https: 'http://arturojkl:HQKxDbtCiC@45.166.110.64:50100',
  socks5: 'socks5://arturojkl:HQKxDbtCiC@45.166.110.64:50101'
};

export function createProxyConfig(account, req, targetDomain) {
  const cookieManager = new CookieManager(account);
  const headers = getDefaultHeaders(req.headers['user-agent']);
  
  // Obtener cookies del usuario actual
  const userCookies = cookieManager.parseCookieHeader(req.headers.cookie);
  const cookieString = cookieManager.getCookieString(userCookies);

  // Create proxy agents
  const httpsAgent = new HttpsProxyAgent(PROXY_CONFIG.https);
  const socksAgent = new SocksProxyAgent(PROXY_CONFIG.socks5);

  return {
    target: account.url,
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    autoRewrite: true,
    ws: true,
    xfwd: true,
    agent: targetDomain.includes('netflix.com') ? socksAgent : httpsAgent,
    cookieDomainRewrite: {
      '*': req.get('host')
    },
    cookiePathRewrite: {
      '*': '/'
    },
    preserveHeaderKeyCase: true,
    timeout: 60000,
    proxyTimeout: 60000,
    wsOptions: {
      maxPayload: 64 * 1024 * 1024,
      perMessageDeflate: true
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

        // Log para debugging
        console.log('Proxy Request Headers:', proxyReq.getHeaders());
      } catch (error) {
        console.error('Error in onProxyReq:', error);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      try {
        // Eliminar headers problemáticos
        EXCLUDED_HEADERS.forEach(header => {
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

        // Log para debugging
        console.log('Proxy Response Headers:', proxyRes.headers);
      } catch (error) {
        console.error('Error in onProxyRes:', error);
      }
    },
    onProxyReqWs: (proxyReq, req, socket) => {
      try {
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