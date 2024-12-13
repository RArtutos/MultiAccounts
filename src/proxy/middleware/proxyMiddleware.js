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
      selfHandleResponse: true,

      onProxyReq: (proxyReq, req) => {
        // Set headers first
        this.headerManager.setHeaders(proxyReq, req);
        
        // Then set cookies to ensure they're not overwritten
        this.cookieManager.setCookies(proxyReq, account);
        
        // Set the host header to match the target
        proxyReq.setHeader('host', targetDomain);
      },

      onProxyRes: (proxyRes, req, res) => {
        this.responseHandler.handle(proxyRes, req, res, account, targetDomain);
      },

      pathRewrite: (path, req) => {
        return this.urlRewriter.rewritePath(path, req, account);
      }
    };

    return createProxyMiddleware(proxyConfig);
  }
}