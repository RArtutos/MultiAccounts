import { parse as parseCookie } from 'cookie';

export class CookieHandler {
  constructor(account) {
    this.account = account;
  }

  getAccountCookies() {
    if (!this.account.cookies) return '';
    
    // Convertir cookies del objeto a string
    return Object.entries(this.account.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }

  transformCookies(cookies) {
    if (!cookies) return [];
    
    // Parsear y transformar cookies
    return cookies.split(';')
      .map(cookie => cookie.trim())
      .filter(Boolean)
      .map(cookie => {
        try {
          const parsed = parseCookie(cookie);
          return Object.entries(parsed)
            .map(([name, value]) => `${name}=${value}`)
            .join('; ');
        } catch (error) {
          console.error('Error parsing cookie:', error);
          return cookie;
        }
      })
      .filter(Boolean);
  }

  injectAccountCookies(headers) {
    const accountCookies = this.getAccountCookies();
    if (!accountCookies) return headers;

    const existingCookies = headers['cookie'] || '';
    const allCookies = existingCookies ? 
      `${existingCookies}; ${accountCookies}` : 
      accountCookies;
    
    headers['cookie'] = allCookies;
    return headers;
  }
}