export class CookieManager {
  setCookies(proxyReq, account) {
    if (!account.cookies) return;

    const cookieString = Object.entries(account.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');

    if (cookieString) {
      const existingCookie = proxyReq.getHeader('cookie') || '';
      const newCookie = existingCookie ? 
        `${existingCookie}; ${cookieString}` : 
        cookieString;
      
      proxyReq.setHeader('cookie', newCookie);
    }
  }
}