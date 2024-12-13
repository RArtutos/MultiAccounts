export class HeaderManager {
  constructor(proxyReq, userAgent) {
    this.proxyReq = proxyReq;
    this.userAgent = userAgent;
    this.defaultHeaders = {
      'User-Agent': this.userAgent,
      'Accept': '*/*',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
  }

  setHeaders() {
    try {
      Object.entries(this.defaultHeaders).forEach(([key, value]) => {
        if (!this.proxyReq.getHeader(key)) {
          this.proxyReq.setHeader(key, value);
        }
      });
    } catch (error) {
      console.error('Error setting headers:', error);
    }
  }
}