import { parse } from 'cookie';

export class CookieParser {
  static parseCookieString(cookieString) {
    if (!cookieString) return {};
    return parse(cookieString);
  }

  static parseSetCookieHeader(header) {
    if (!header) return null;

    const [cookiePart, ...directives] = header.split(';');
    const parsed = this.parseCookieString(cookiePart);
    const [[name, value]] = Object.entries(parsed);

    const options = directives.reduce((acc, directive) => {
      const [key, val = true] = directive.trim().toLowerCase().split('=');
      acc[key] = val;
      return acc;
    }, {});

    return { name, value, options };
  }
}