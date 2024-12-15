export class CookieManager {
  constructor(account) {
    this.account = account;
    this.userCookies = new Map();
  }

  mergeCookies(accountCookies = {}, userCookies = {}) {
    // Priorizar las cookies del usuario sobre las de la cuenta
    return {
      ...accountCookies,
      ...userCookies
    };
  }

  getCookieString(userCookies = {}) {
    const mergedCookies = this.mergeCookies(this.account.cookies, userCookies);
    return Object.entries(mergedCookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
  }

  parseCookieHeader(cookieHeader) {
    if (!cookieHeader) return {};
    
    try {
      return cookieHeader.split(';')
        .reduce((acc, cookie) => {
          const [name, value] = cookie.trim().split('=');
          if (name && value) {
            acc[name.trim()] = value.trim();
          }
          return acc;
        }, {});
    } catch (error) {
      console.error('Error parsing cookie header:', error);
      return {};
    }
  }

  handleResponseCookies(setCookieHeaders) {
    if (!Array.isArray(setCookieHeaders)) {
      setCookieHeaders = [setCookieHeaders];
    }

    const newCookies = {};

    for (const cookieHeader of setCookieHeaders) {
      try {
        // Extraer nombre y valor de la cookie
        const [nameValue, ...options] = cookieHeader.split(';');
        const [name, value] = nameValue.split('=');

        if (name && value) {
          // Analizar opciones de la cookie
          const cookieOptions = options.reduce((acc, opt) => {
            const [key, val] = opt.trim().split('=');
            if (key) acc[key.toLowerCase()] = val || true;
            return acc;
          }, {});

          // Almacenar la cookie con sus opciones
          newCookies[name.trim()] = {
            value: value.trim(),
            options: cookieOptions
          };
        }
      } catch (error) {
        console.error('Error parsing Set-Cookie header:', error);
      }
    }

    return newCookies;
  }

  updateAccountCookies(newCookies) {
    if (!this.account.cookies) {
      this.account.cookies = {};
    }

    // Actualizar cookies existentes y agregar nuevas
    for (const [name, { value, options }] of Object.entries(newCookies)) {
      this.account.cookies[name] = value;
    }
  }

  setUserCookies(userId, cookies) {
    this.userCookies.set(userId, cookies);
  }

  getUserCookies(userId) {
    return this.userCookies.get(userId) || {};
  }

  cleanExpiredCookies() {
    if (!this.account.cookies) return;

    const now = new Date();
    Object.entries(this.account.cookies).forEach(([name, { value, options }]) => {
      if (options && options.expires) {
        const expires = new Date(options.expires);
        if (expires < now) {
          delete this.account.cookies[name];
        }
      }
    });
  }
}