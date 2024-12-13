import { parse as parseCookie } from 'cookie';

export class CookieHandler {
  constructor(account) {
    this.account = account;
  }

  getAccountCookies() {
    if (!this.account?.cookies || Object.keys(this.account.cookies).length === 0) {
      return '';
    }
    
    try {
      return Object.entries(this.account.cookies)
        .filter(([name, value]) => name && value)
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
    } catch (error) {
      console.warn('Warning: Error getting account cookies:', error.message);
      return '';
    }
  }

  transformCookies(cookies) {
    if (!Array.isArray(cookies)) {
      return [];
    }

    return cookies.map(cookie => {
      try {
        if (!cookie || typeof cookie !== 'string') {
          return null;
        }

        const [cookieHeader] = cookie.split(';');
        const parsed = parseCookie(cookieHeader);
        
        return Object.entries(parsed)
          .filter(([name, value]) => name && value)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ');
      } catch (error) {
        console.warn('Warning: Error transforming cookie:', error.message);
        return null;
      }
    }).filter(Boolean);
  }
}