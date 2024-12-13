export class HeaderHandler {
  constructor(targetDomain) {
    this.targetDomain = targetDomain;
  }

  getDefaultHeaders(userAgent) {
    return {
      'User-Agent': userAgent || 'Mozilla/5.0',
      'Accept': '*/*',
      'Accept-Language': 'es-MX,es;q=0.9,en;q=0.8',
      'Accept-Encoding': 'gzip, deflate',
      'host': this.targetDomain,
      'x-forwarded-for': '45.166.110.64',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };
  }

  removeProblematicHeaders(headers) {
    if (!headers || typeof headers !== 'object') {
      return;
    }

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