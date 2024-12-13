export class CookieManager {
  formatCookie(name, value, domain) {
    const cookie = {
      name: String(name),
      value: String(value),
      domain: domain,
      path: '/',
      secure: true,
      sameSite: 'None'
    };

    // Validar el cookie antes de devolverlo
    if (this.validateCookie(cookie)) {
      return cookie;
    }
    return null;
  }

  formatCookies(cookiesObj, domain) {
    if (!cookiesObj || typeof cookiesObj !== 'object') {
      return [];
    }

    return Object.entries(cookiesObj)
      .map(([name, value]) => this.formatCookie(name, value, domain))
      .filter(Boolean); // Eliminar cookies inválidos (null)
  }

  validateCookie(cookie) {
    if (!cookie.name || !cookie.value) {
      console.warn('Cookie inválida: falta nombre o valor');
      return false;
    }

    if (cookie.domain) {
      // El dominio debe comenzar con un punto o una letra
      if (!/^[a-zA-Z0-9]|^\.[a-zA-Z0-9]/.test(cookie.domain)) {
        console.warn(`Cookie inválida: dominio inválido ${cookie.domain}`);
        return false;
      }
    }

    if (cookie.path && !cookie.path.startsWith('/')) {
      console.warn(`Cookie inválida: ruta inválida ${cookie.path}`);
      return false;
    }

    return true;
  }

  getCookieString(cookies, domain) {
    const formattedCookies = this.formatCookies(cookies, domain);
    return formattedCookies
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');
  }

  parseCookieString(cookieString) {
    if (!cookieString) return {};
    
    return cookieString.split(';')
      .reduce((acc, pair) => {
        const [name, value] = pair.trim().split('=');
        if (name && value) {
          acc[name.trim()] = value.trim();
        }
        return acc;
      }, {});
  }
}