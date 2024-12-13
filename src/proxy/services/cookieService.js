import { deviceService } from './deviceService.js';

export class CookieService {
  constructor() {
    this.cookieStore = new Map();
  }

  async storeCookies(accountName, cookies) {
    this.cookieStore.set(accountName, cookies);
    await deviceService.updateDeviceCookies(accountName, cookies);
  }

  getCookies(accountName) {
    return this.cookieStore.get(accountName) || {};
  }

  parseCookies(cookieHeader) {
    if (!cookieHeader) return {};
    return cookieHeader.split(';')
      .reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = value;
        return cookies;
      }, {});
  }

  serializeCookies(cookies) {
    return Object.entries(cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }
}

export const cookieService = new CookieService();