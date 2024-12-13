export class CookieManager {
  setCookies(proxyReq, account) {
    try {
      if (!account.cookies) return;

      const cookieString = Object.entries(account.cookies)
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');

      if (cookieString) {
        // Get existing cookies
        const existingCookie = proxyReq.getHeader('cookie') || '';
        
        // Combine existing and account cookies
        const newCookie = existingCookie ? 
          `${existingCookie}; ${cookieString}` : 
          cookieString;

        // Set the combined cookies
        proxyReq.setHeader('cookie', newCookie);
      }
    } catch (error) {
      console.error('Error setting cookies:', error);
    }
  }

  parseCookies(cookieHeader) {
    if (!cookieHeader) return {};
    
    return cookieHeader.split(';')
      .reduce((cookies, cookie) => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          cookies[name.trim()] = value.trim();
        }
        return cookies;
      }, {});
  }
}