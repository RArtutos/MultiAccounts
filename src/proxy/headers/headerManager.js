export class HeaderManager {
  constructor() {
    this.defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
  }

  setHeaders(proxyReq, req) {
    try {
      // Set default headers if they don't exist
      Object.entries(this.defaultHeaders).forEach(([key, value]) => {
        if (!proxyReq.getHeader(key)) {
          proxyReq.setHeader(key, value);
        }
      });

      // Set forwarding headers
      proxyReq.setHeader('x-forwarded-for', req.ip);
      proxyReq.setHeader('x-forwarded-proto', req.protocol);
      proxyReq.setHeader('x-forwarded-host', req.get('host'));

      // Copy important request headers
      const headersToKeep = ['accept', 'accept-encoding', 'accept-language'];
      headersToKeep.forEach(header => {
        const value = req.headers[header];
        if (value) {
          proxyReq.setHeader(header, value);
        }
      });

    } catch (error) {
      console.error('Error setting headers:', error);
    }
  }
}