import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { RequestHandler } from '../handlers/requestHandler.js';
import { ResponseHandler } from '../handlers/responseHandler.js';

const PROXY_CONFIG = {
  http: process.env.HTTP_PROXY,
  https: process.env.HTTPS_PROXY,
  socks5: process.env.SOCKS_PROXY
};

export function createProxyConfig(account, req, targetDomain) {
  const requestHandler = new RequestHandler(account, targetDomain);
  const responseHandler = new ResponseHandler(account);
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
    selfHandleResponse: false,
    onProxyReq: (proxyReq, req) => {
      requestHandler.handleRequest(proxyReq, req);
    },
    onProxyRes: (proxyRes, req, res) => {
      responseHandler.handleResponse(proxyRes, req, res);
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error de proxy');
      }
    }
  };
}