import { parse, serialize } from 'cookie';

export class CookieHandler {
  constructor(account, targetDomain) {
    this.account = account;
    this.targetDomain = targetDomain;
  }

  handleRequest(proxyReq, req) {
    try {
      // Combinar cookies del account y de la request
      const accountCookies = this.account.cookies || {};
      const requestCookies = req.headers.cookie ? parse(req.headers.cookie) : {};
      
      const allCookies = {
        ...requestCookies,
        ...accountCookies
      };

      if (Object.keys(allCookies).length > 0) {
        const cookieHeader = Object.entries(allCookies)
          .map(([name, value]) => serialize(name, value, {
            domain: this.targetDomain,
            path: '/',
            secure: true,
            sameSite: 'none'
          }))
          .join('; ');

        if (!proxyReq._headerSent) {
          proxyReq.setHeader('cookie', cookieHeader);
        }
      }
    } catch (error) {
      console.error('Error handling request cookies:', error);
    }
  }

  handleResponse(proxyRes, req) {
    try {
      const setCookieHeaders = proxyRes.headers['set-cookie'];
      if (!Array.isArray(setCookieHeaders)) return;

      proxyRes.headers['set-cookie'] = setCookieHeaders.map(header => {
        try {
          const [cookiePart, ...directives] = header.split(';');
          const parsed = parse(cookiePart);
          const [[name, value]] = Object.entries(parsed);

          // Mantener todas las directivas excepto domain y path
          const options = directives.reduce((acc, directive) => {
            const [key, val = true] = directive.trim().toLowerCase().split('=');
            if (!['domain', 'path'].includes(key)) {
              acc[key] = val;
            }
            return acc;
          }, {});

          return serialize(name, value, {
            ...options,
            domain: this.targetDomain,
            path: '/',
            secure: true,
            sameSite: 'none'
          });
        } catch (error) {
          console.error('Error transforming cookie:', error);
          return header;
        }
      });
    } catch (error) {
      console.error('Error handling response cookies:', error);
    }
  }
}