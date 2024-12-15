import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { CookieManager } from '../cookies/cookieManager.js';
import { HeaderManager } from '../headers/headerManager.js';
import { getDefaultHeaders } from './headers.js';
import { setupRequestHeaders } from '../headers/requestHeaders.js';
import { setupResponseHeaders } from '../headers/responseHeaders.js';

const PROXY_CONFIG = {
  http: process.env.HTTP_PROXY,
  https: process.env.HTTPS_PROXY,
  socks5: process.env.SOCKS_PROXY
};

export function createProxyConfig(account, req, targetDomain) {
  const cookieManager = new CookieManager(account);
  const headerManager = new HeaderManager();
  const headers = getDefaultHeaders(req.headers['user-agent']);
  
  const userCookies = cookieManager.parseCookieHeader(req.headers.cookie);
  const cookieString = cookieManager.getCookieString(userCookies);

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
    wsOptions: {
      maxPayload: 128 * 1024 * 1024,
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
        // Handle POST data first
        if (req.method === 'POST' && req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }

        // Setup request headers after body is written
        setupRequestHeaders(proxyReq, req, targetDomain);
      } catch (error) {
        console.error('Error in onProxyReq:', error);
      }
    },
    onProxyRes: (proxyRes, req, res) => {
      try {
        if (!res.headersSent) {
          setupResponseHeaders(proxyRes, req, res);
        }

        // Handle cookies
        if (proxyRes.headers['set-cookie']) {
          const newCookies = cookieManager.handleResponseCookies(proxyRes.headers['set-cookie']);
          cookieManager.updateAccountCookies(newCookies);

          proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(cookie => {
            return cookie
              .replace(/Domain=[^;]+/, `Domain=${req.get('host')}`)
              .replace(/Path=[^;]+/, 'Path=/');
          });
        }

        // Handle redirects
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

        console.log('Proxy Response Headers:', proxyRes.headers);
      } catch (error) {
        console.error('Error in onProxyRes:', error);
      }
    },
    onProxyReqWs: (proxyReq, req, socket) => {
      try {
        proxyReq.setHeader('Origin', account.url);
        if (req.headers['sec-websocket-protocol']) {
          proxyReq.setHeader('Sec-WebSocket-Protocol', req.headers['sec-websocket-protocol']);
        }

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