import { cookieStore } from './CookieStore.js';
import { CookieParser } from './CookieParser.js';
import { CookieSerializer } from './CookieSerializer.js';
import { CookieDebugger } from './CookieDebugger.js';

export class CookieManager {
  constructor(account) {
    this.account = account;
    this.accountId = account.name;
  }

  handleIncomingCookies(cookieHeader) {
    try {
      CookieDebugger.logCookie('Incoming Cookies', { header: cookieHeader });

      if (!cookieHeader) return;

      // Primero, usar las cookies configuradas en el panel de administración
      if (this.account.cookies) {
        Object.entries(this.account.cookies).forEach(([name, value]) => {
          cookieStore.set(this.accountId, name, value, {
            path: '/',
            sameSite: 'none',
            secure: true
          });
          CookieDebugger.logCookie('Admin Cookie Set', { name, value });
        });
      }

      // Luego, procesar las cookies de la petición
      const cookies = CookieParser.parseCookieString(cookieHeader);
      Object.entries(cookies).forEach(([name, value]) => {
        cookieStore.set(this.accountId, name, value);
        CookieDebugger.logCookie('Request Cookie Set', { name, value });
      });
    } catch (error) {
      CookieDebugger.logError('handleIncomingCookies', error, { cookieHeader });
    }
  }

  handleOutgoingCookies() {
    try {
      const cookies = [
        // Primero las cookies del admin panel
        ...Object.entries(this.account.cookies || {}),
        // Luego las cookies almacenadas
        ...cookieStore.getAll(this.accountId)
      ];

      const serializedCookies = cookies.map(([name, value]) => {
        const cookieValue = typeof value === 'object' ? value.value : value;
        const options = typeof value === 'object' ? value.options : {};
        
        return CookieSerializer.serializeCookie(name, cookieValue, {
          ...options,
          path: '/',
          sameSite: 'none',
          secure: true
        });
      });

      const cookieString = serializedCookies.join('; ');
      CookieDebugger.logCookie('Outgoing Cookies', { cookies: cookieString });
      return cookieString;
    } catch (error) {
      CookieDebugger.logError('handleOutgoingCookies', error);
      return '';
    }
  }

  handleSetCookieHeaders(headers) {
    try {
      if (!Array.isArray(headers)) return [];

      const transformedHeaders = headers.map(header => {
        const parsed = CookieParser.parseSetCookieHeader(header);
        if (!parsed) return null;

        const { name, value, options } = parsed;
        
        // Guardar en el store
        cookieStore.set(this.accountId, name, value, options);

        // También actualizar las cookies del admin panel
        if (!this.account.cookies) this.account.cookies = {};
        this.account.cookies[name] = value;

        CookieDebugger.logCookie('Set-Cookie Transformed', { name, value, options });

        return CookieSerializer.serializeSetCookie(name, value, {
          ...options,
          domain: null,
          path: '/',
          secure: true,
          sameSite: 'none'
        })[0];
      }).filter(Boolean);

      CookieDebugger.logCookie('Set-Cookie Headers', { 
        original: headers,
        transformed: transformedHeaders 
      });

      return transformedHeaders;
    } catch (error) {
      CookieDebugger.logError('handleSetCookieHeaders', error, { headers });
      return [];
    }
  }
}