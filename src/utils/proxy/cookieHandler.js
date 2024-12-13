import { parse, serialize } from 'cookie';

export class CookieHandler {
  constructor(account) {
    this.account = account;
  }

  getAccountCookies() {
    if (!this.account?.cookies) return '';

    try {
      return Object.entries(this.account.cookies)
        .filter(([name, value]) => name && value)
        .map(([name, value]) => serialize(name, value, {
          path: '/',
          sameSite: 'none'
        }))
        .join('; ');
    } catch (error) {
      console.error('Error getting account cookies:', error);
      return '';
    }
  }

  transformCookies(cookieHeaders) {
    if (!Array.isArray(cookieHeaders)) return [];

    return cookieHeaders.map(header => {
      try {
        // Split cookie and its attributes
        const [cookiePart, ...attributes] = header.split(';');
        
        // Parse the main cookie part
        const parsed = parse(cookiePart);
        const [[name, value]] = Object.entries(parsed);

        // Build new cookie with modified attributes
        return serialize(name, value, {
          path: '/',
          sameSite: 'none',
          secure: false
        });
      } catch (error) {
        console.error('Error transforming cookie:', error);
        return null;
      }
    }).filter(Boolean);
  }
}