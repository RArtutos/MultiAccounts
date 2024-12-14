import { velocityConfig } from '../config/velocity.js';
import { CookieManager } from '../utils/cookies/cookieManager.js';

export class VelocityService {
  constructor(account) {
    this.account = account;
    this.cookieManager = new CookieManager(account);
    this.config = {
      ...velocityConfig,
      target: account.url
    };
  }

  async createProxyInstance() {
    const cookies = await this.cookieManager.getAccountCookies();
    const cookieString = await this.cookieManager.getCookieString();

    return {
      config: {
        ...this.config,
        cookies,
        headers: {
          ...velocityConfig.netflix.headers,
          'Cookie': cookieString
        }
      }
    };
  }

  getProxyUrl(path = '') {
    const baseUrl = this.account.url;
    const encodedUrl = encodeURIComponent(`${baseUrl}${path}`);
    return `${velocityConfig.prefix}${encodedUrl}`;
  }
}