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
          sameSite: 'none',
          secure: true,
          domain: null // Permitir que el dominio se maneje automáticamente
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

        // Mantener atributos originales excepto domain y path
        const originalAttributes = attributes.reduce((acc, attr) => {
          const [key, val] = attr.trim().toLowerCase().split('=');
          if (!['domain', 'path'].includes(key)) {
            acc[key] = val || true;
          }
          return acc;
        }, {});

        // Build new cookie with modified attributes
        return serialize(name, value, {
          path: '/',
          sameSite: 'none',
          secure: true,
          httpOnly: originalAttributes.httponly || false,
          ...originalAttributes,
          domain: null // Permitir que el dominio se maneje automáticamente
        });
      } catch (error) {
        console.error('Error transforming cookie:', error);
        return null;
      }
    }).filter(Boolean);
  }
}