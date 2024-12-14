import { parse as parseCookie } from 'cookie';

export class CookieManager {
  constructor(account) {
    this.account = account;
  }

  async getAccountCookies() {
    return this.account.cookies || {};
  }

  async getCookieString() {
    const cookies = await this.getAccountCookies();
    return Object.entries(cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }

  parseCookieHeader(cookieHeader) {
    if (!cookieHeader) return {};
    
    try {
      return cookieHeader.split(';')
        .reduce((acc, cookie) => {
          const [name, value] = cookie.trim().split('=');
          if (name && value) {
            acc[name.trim()] = value.trim();
          }
          return acc;
        }, {});
    } catch (error) {
      console.error('Error parsing cookie header:', error);
      return {};
    }
  }

  async updateCookies(newCookies) {
    this.account.cookies = {
      ...this.account.cookies,
      ...newCookies
    };
    return this.account.cookies;
  }
}