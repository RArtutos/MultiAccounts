import { serialize } from 'cookie';

export class CookieSerializer {
  static serializeCookie(name, value, options = {}) {
    const defaultOptions = {
      path: '/',
      sameSite: 'none',
      secure: true,
      httpOnly: true
    };

    return serialize(name, value, { ...defaultOptions, ...options });
  }

  static serializeSetCookie(name, value, options = {}) {
    const serialized = this.serializeCookie(name, value, options);
    return [serialized];
  }
}