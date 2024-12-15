import { StaticHandler } from '../static/staticHandler.js';

export class RequestHandler {
  constructor(account, req) {
    this.account = account;
    this.req = req;
    this.staticHandler = new StaticHandler();
  }

  createPathRewrite() {
    const accountPath = `/stream/${encodeURIComponent(this.account.name)}`;
    
    return (path) => {
      if (this.staticHandler.isStaticResource(path)) {
        return path;
      }

      return path.startsWith(accountPath) ? 
        path.slice(accountPath.length) || '/' : 
        path;
    };
  }

  handleRequest(proxyReq) {
    try {
      // Headers básicos
      const headers = {
        'User-Agent': this.req.headers['user-agent'],
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      };

      // Establecer headers
      for (const [key, value] of Object.entries(headers)) {
        if (!proxyReq.getHeader(key)) {
          proxyReq.setHeader(key, value);
        }
      }

      // Gestionar cookies
      if (this.account.cookies) {
        const cookieString = Object.entries(this.account.cookies)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ');
        
        if (cookieString && !proxyReq.getHeader('cookie')) {
          proxyReq.setHeader('cookie', cookieString);
        }
      }
    } catch (error) {
      console.error('Error handling request:', error);
    }
  }
}