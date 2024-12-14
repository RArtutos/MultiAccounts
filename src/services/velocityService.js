import { velocityConfig } from '../config/velocity.js';
import { CookieManager } from '../utils/cookies/cookieManager.js';

export class VelocityService {
  constructor(account) {
    this.account = account;
    this.cookieManager = new CookieManager(account);
  }

  async createProxyInstance() {
    const config = {
      ...velocityConfig,
      cookies: await this.cookieManager.getAccountCookies(),
      headers: {
        ...velocityConfig.netflix.headers,
        'Cookie': await this.cookieManager.getCookieString()
      }
    };

    return {
      config,
      getProxyUrl: (path = '') => {
        const encodedUrl = encodeURIComponent(`${velocityConfig.netflix.url}${path}`);
        return `${velocityConfig.prefix}${encodedUrl}`;
      }
    };
  }
}