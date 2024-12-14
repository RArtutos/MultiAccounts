import { parse as parseCookie } from 'cookie';

export class CookieHandler {
  constructor(account) {
    this.account = account;
  }

  getAccountCookies() {
    if (!this.account.cookies) return '';
    return Object.entries(this.account.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }

  transformCookies(cookies) {
    if (!cookies) return [];
    return cookies.split(';')
      .map(cookie => {
        const parsed = parseCookie(cookie.trim());
        return Object.entries(parsed)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ');
      });
  }

  injectAccountCookies(headers) {
    const accountCookies = this.getAccountCookies();
    if (!accountCookies) return headers;

    const existingCookies = headers['cookie'] || '';
    headers['cookie'] = existingCookies ? 
      `${existingCookies}; ${accountCookies}` : 
      accountCookies;
    
    return headers;
  }
}