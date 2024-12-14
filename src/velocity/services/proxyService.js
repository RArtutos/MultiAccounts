import { createProxyMiddleware } from 'http-proxy-middleware';
import { velocityConfig } from '../config/index.js';
import { createPathRewriter } from '../utils/pathUtils.js';

export class ProxyService {
  constructor(account) {
    this.account = account;
  }

  createProxy() {
    const headers = {
      ...velocityConfig.headers,
      ...(this.account.cookies && {
        'Cookie': Object.entries(this.account.cookies)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ')
      })
    };

    return createProxyMiddleware({
      target: this.account.url,
      changeOrigin: true,
      secure: true,
      ws: true,
      headers,
      pathRewrite: createPathRewriter(velocityConfig.prefix)
    });
  }
}