export class RequestHandler {
  constructor(account, targetDomain) {
    this.account = account;
    this.targetDomain = targetDomain;
  }

  handleRequest(proxyReq, req) {
    try {
      // Establecer headers básicos
      const baseHeaders = {
        'host': this.targetDomain,
        'origin': this.account.url,
        'referer': this.account.url
      };

      // Copiar headers importantes del request original
      const headersToKeep = [
        'user-agent',
        'accept',
        'accept-language',
        'accept-encoding',
        'cache-control',
        'pragma'
      ];

      headersToKeep.forEach(header => {
        if (req.headers[header]) {
          baseHeaders[header] = req.headers[header];
        }
      });

      // Establecer headers
      Object.entries(baseHeaders).forEach(([key, value]) => {
        if (value) {
          try {
            proxyReq.setHeader(key, value);
          } catch (e) {
            // Ignorar errores de headers
          }
        }
      });

      // Manejar cookies
      if (this.account.cookies) {
        const cookieString = Object.entries(this.account.cookies)
          .map(([name, value]) => `${name}=${value}`)
          .join('; ');

        if (cookieString) {
          try {
            proxyReq.setHeader('cookie', cookieString);
          } catch (e) {
            // Ignorar errores de cookies
          }
        }
      }

      // Manejar datos POST
      if (req.method === 'POST' && req.body) {
        try {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('content-length', Buffer.byteLength(bodyData));
          proxyReq.setHeader('content-type', 'application/json');
          proxyReq.write(bodyData);
        } catch (e) {
          console.error('Error writing POST data:', e);
        }
      }
    } catch (error) {
      console.error('Error handling request:', error);
    }
  }
}