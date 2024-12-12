import { createProxyMiddleware } from 'http-proxy-middleware';
import { proxyConfig } from '../config/proxyConfig.js';
import { ProxyError } from '../errors/ProxyError.js';
import { HeaderManager } from '../managers/HeaderManager.js';
import { CookieManager } from '../managers/CookieManager.js';
import { ResponseHandler } from '../handlers/ResponseHandler.js';
import HttpProxyAgent from 'http-proxy-agent';
import HttpsProxyAgent from 'https-proxy-agent';

export class ProxyService {
  constructor() {
    this.headerManager = new HeaderManager();
    this.cookieManager = new CookieManager();
    this.responseHandler = new ResponseHandler();
  }

  createProxyMiddleware(account, targetDomain) {
    const proxyUrl = `http://${proxyConfig.squid.host}:${proxyConfig.squid.port}`;
    const httpAgent = new HttpProxyAgent(proxyUrl);
    const httpsAgent = new HttpsProxyAgent(proxyUrl);

    const proxyOptions = {
      target: account.url,
      changeOrigin: true,
      secure: true,
      xfwd: true,
      proxyTimeout: proxyConfig.timeouts.read,
      timeout: proxyConfig.timeouts.connect,
      agent: {
        http: httpAgent,
        https: httpsAgent
      },
      onProxyReq: (proxyReq, req) => {
        this.headerManager.setHeaders(proxyReq, req);
        this.cookieManager.setCookies(proxyReq, account);
      },
      onProxyRes: (proxyRes, req, res) => {
        this.responseHandler.handle(proxyRes, req, res, account);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        this.handleProxyError(err, req, res);
      }
    };

    return createProxyMiddleware(proxyOptions);
  }

  handleProxyError(err, req, res) {
    const error = new ProxyError('Proxy request failed', err);
    if (!res.headersSent) {
      res.status(502).json({
        error: 'Proxy Error',
        message: error.message
      });
    }
  }
}