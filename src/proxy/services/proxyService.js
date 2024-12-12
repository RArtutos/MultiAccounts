import { createProxyMiddleware } from 'http-proxy-middleware';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { proxyConfig } from '../config/proxyConfig.js';
import { ProxyError } from '../errors/ProxyError.js';
import { HeaderManager } from '../managers/HeaderManager.js';
import { CookieManager } from '../managers/CookieManager.js';
import { ResponseHandler } from '../handlers/ResponseHandler.js';
import { PathRewriter } from '../utils/PathRewriter.js';

export class ProxyService {
  constructor() {
    this.headerManager = new HeaderManager();
    this.cookieManager = new CookieManager();
    this.responseHandler = new ResponseHandler();
    this.pathRewriter = new PathRewriter();
  }

  createProxyMiddleware(account, targetDomain) {
    const proxyUrl = `http://${proxyConfig.squid.host}:${proxyConfig.squid.port}`;
    const agent = account.url.startsWith('https:') ? 
      new HttpsProxyAgent(proxyUrl) : 
      new HttpProxyAgent(proxyUrl);

    const proxyOptions = {
      target: account.url,
      changeOrigin: true,
      secure: true,
      xfwd: true,
      followRedirects: true,
      proxyTimeout: proxyConfig.timeouts.read,
      timeout: proxyConfig.timeouts.connect,
      agent,
      pathRewrite: (path, req) => {
        return this.pathRewriter.rewrite(path, req);
      },
      onProxyReq: (proxyReq, req) => {
        try {
          if (!proxyReq.headersSent) {
            this.headerManager.setHeaders(proxyReq, req);
            this.cookieManager.setCookies(proxyReq, account);
            
            // Reescribir la URL original
            const originalUrl = new URL(account.url);
            proxyReq.path = req.originalPath || '/';
            proxyReq.setHeader('host', originalUrl.host);
          }
        } catch (error) {
          console.error('Error in onProxyReq:', error);
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        try {
          this.responseHandler.handle(proxyRes, req, res, account);
        } catch (error) {
          console.error('Error in onProxyRes:', error);
          if (!res.headersSent) {
            res.status(500).send('Error processing proxy response');
          }
        }
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