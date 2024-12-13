export class CookieManager {
  constructor(proxyReq, account) {
    this.proxyReq = proxyReq;
    this.account = account;
  }

  setCookies() {
    try {
      if (this.account.cookies) {
        const cookieString = Object.entries(this.account.cookies)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ');

        if (cookieString) {
          const existingCookie = this.proxyReq.getHeader('cookie') || '';
          const newCookie = existingCookie ? 
            `${existingCookie}; ${cookieString}` : 
            cookieString;
          
          this.proxyReq.setHeader('cookie', newCookie);
        }
      }
    } catch (error) {
      console.error('Error setting cookies:', error);
    }
  }
}