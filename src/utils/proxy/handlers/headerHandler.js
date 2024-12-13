export class HeaderHandler {
  constructor(targetDomain) {
    this.targetDomain = targetDomain;
  }

  setHeaders(proxyReq, req) {
    if (proxyReq._headerSent) return;

    const headers = {
      'user-agent': req.headers['user-agent'] || 'Mozilla/5.0',
      'accept': req.headers['accept'] || '*/*',
      'accept-language': req.headers['accept-language'] || 'en-US,en;q=0.9',
      'accept-encoding': req.headers['accept-encoding'] || 'gzip, deflate, br',
      'host': this.targetDomain,
      'cache-control': 'no-cache',
      'pragma': 'no-cache'
    };

    Object.entries(headers).forEach(([key, value]) => {
      try {
        if (!proxyReq._headerSent) {
          proxyReq.setHeader(key, value);
        }
      } catch (error) {
        console.warn(`Warning: Could not set header ${key}:`, error.message);
      }
    });
  }

  removeProblematicHeaders(headers) {
    const headersToRemove = [
      'content-security-policy',
      'x-frame-options',
      'content-security-policy-report-only',
      'strict-transport-security',
      'x-content-type-options',
      'x-xss-protection',
      'clear-site-data'
    ];

    headersToRemove.forEach(header => {
      delete headers[header.toLowerCase()];
    });
  }
}