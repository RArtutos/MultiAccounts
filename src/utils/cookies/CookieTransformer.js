import { parse, serialize } from 'cookie';

export class CookieTransformer {
  static parseCookie(cookieString) {
    try {
      return parse(cookieString);
    } catch (error) {
      console.error('Error parsing cookie:', error);
      return {};
    }
  }

  static serializeCookie(name, value, options = {}) {
    const defaultOptions = {
      path: '/',
      secure: true,
      sameSite: 'none',
      httpOnly: true
    };

    return serialize(name, value, { ...defaultOptions, ...options });
  }

  static transformSetCookie(cookieHeader, targetDomain) {
    try {
      const [cookiePart, ...directives] = cookieHeader.split(';');
      const parsed = this.parseCookie(cookiePart);
      const [[name, value]] = Object.entries(parsed);

      const options = directives.reduce((acc, directive) => {
        const [key, val = true] = directive.trim().toLowerCase().split('=');
        if (!['domain', 'path'].includes(key)) {
          acc[key] = val;
        }
        return acc;
      }, {});

      return this.serializeCookie(name, value, {
        ...options,
        domain: targetDomain,
        path: '/'
      });
    } catch (error) {
      console.error('Error transforming Set-Cookie:', error);
      return null;
    }
  }
}