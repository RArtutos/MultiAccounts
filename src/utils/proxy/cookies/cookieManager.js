import { parse as parseCookie } from 'cookie';

export class CookieManager {
  constructor(account) {
    this.account = account;
    this.userCookies = new Map();
  }

  mergeCookies(accountCookies = {}, userCookies = {}) {
    // Priorizar las cookies del usuario sobre las de la cuenta
    return {
      ...accountCookies,
      ...userCookies
    };
  }

  getCookieString(userCookies = {}) {
    const mergedCookies = this.mergeCookies(this.account.cookies, userCookies);
    return Object.entries(mergedCookies)
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

  handleResponseCookies(setCookieHeaders) {
    if (!Array.isArray(setCookieHeaders)) {
      setCookieHeaders = [setCookieHeaders];
    }

    const newCookies = {};

    for (const cookieHeader of setCookieHeaders) {
      try {
        const [nameValue] = cookieHeader.split(';');
        const [name, value] = nameValue.split('=');
        if (name && value) {
          newCookies[name.trim()] = value.trim();
        }
      } catch (error) {
        console.error('Error parsing Set-Cookie header:', error);
      }
    }

    return newCookies;
  }

  updateAccountCookies(newCookies) {
    this.account.cookies = {
      ...this.account.cookies,
      ...newCookies
    };
  }

  setUserCookies(userId, cookies) {
    this.userCookies.set(userId, cookies);
  }

  getUserCookies(userId) {
    return this.userCookies.get(userId) || {};
  }
}