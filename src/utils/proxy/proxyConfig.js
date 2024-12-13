import { StaticHandler } from './static/staticHandler.js';
import { HeaderManager } from './headers/headerManager.js';
import { CookieManager } from './cookies/cookieManager.js';

const staticHandler = new StaticHandler();

export function createProxyConfig(account, req, targetDomain) {
  const accountPath = `/stream/${encodeURIComponent(account.name)}`;
  const userAgent = req.headers['user-agent'];

  return {
    target: account.url,
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    autoRewrite: true,
    ws: true,
    xfwd: true,
    cookieDomainRewrite: {
      '*': req.get('host')
    },
    pathRewrite: (path) => {
      if (staticHandler.isStaticResource(path)) {
        return path;
      }
      return path.startsWith(accountPath) ? 
        path.slice(accountPath.length) || '/' : 
        path;
    },
    onProxyReq: (proxyReq) => {
      try {
        const headerManager = new HeaderManager(proxyReq, userAgent);
        const cookieManager = new CookieManager(proxyReq, account);

        headerManager.setHeaders();
        cookieManager.setCookies();
      } catch (error) {
        console.error('Error in onProxyReq:', error);
      }
    }
  };
}