import { CookieManager } from '../../utils/cookies/cookieManager.js';
import { parseCookieString, validateCookie } from '../../utils/cookies/cookieParser.js';

export class BrowserCookieHandler {
  constructor() {
    this.cookieManagers = new Map();
  }

  getCookieManager(accountId) {
    if (!this.cookieManagers.has(accountId)) {
      this.cookieManagers.set(accountId, new CookieManager());
    }
    return this.cookieManagers.get(accountId);
  }

  formatCookies(cookies, domain) {
    if (!cookies || typeof cookies !== 'object') {
      return [];
    }

    const formattedCookies = [];
    
    // Handle both object and string formats
    if (typeof cookies === 'string') {
      const parsedCookies = parseCookieString(cookies);
      for (const cookie of parsedCookies) {
        const formatted = {
          name: cookie.name,
          value: cookie.value,
          domain: domain.replace(/^www\./, ''),
          path: '/',
          secure: true,
          sameSite: 'None'
        };
        if (validateCookie(formatted)) {
          formattedCookies.push(formatted);
        }
      }
    } else {
      // Handle object format
      for (const [name, value] of Object.entries(cookies)) {
        if (typeof value === 'string' && value.includes(';')) {
          // Handle case where value contains multiple cookies
          const subCookies = parseCookieString(value);
          for (const cookie of subCookies) {
            const formatted = {
              name: cookie.name,
              value: cookie.value,
              domain: domain.replace(/^www\./, ''),
              path: '/',
              secure: true,
              sameSite: 'None'
            };
            if (validateCookie(formatted)) {
              formattedCookies.push(formatted);
            }
          }
        } else {
          const formatted = {
            name,
            value: String(value),
            domain: domain.replace(/^www\./, ''),
            path: '/',
            secure: true,
            sameSite: 'None'
          };
          if (validateCookie(formatted)) {
            formattedCookies.push(formatted);
          }
        }
      }
    }

    return formattedCookies;
  }

  async applyCookies(context, cookies, domain) {
    if (!cookies || (typeof cookies === 'object' && Object.keys(cookies).length === 0)) {
      return;
    }

    try {
      const formattedCookies = this.formatCookies(cookies, domain);
      if (formattedCookies.length > 0) {
        console.log('Applying cookies:', formattedCookies);
        for (const cookie of formattedCookies) {
          try {
            await context.addCookies([cookie]);
          } catch (error) {
            console.warn(`Failed to set cookie ${cookie.name}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error applying cookies:', error);
      throw error;
    }
  }

  getCookieString(cookies, domain) {
    if (!cookies) return '';

    try {
      const formattedCookies = this.formatCookies(cookies, domain);
      return formattedCookies
        .map(cookie => `${cookie.name}=${cookie.value}`)
        .join('; ');
    } catch (error) {
      console.error('Error generating cookie string:', error);
      return '';
    }
  }
}