export class HeaderManager {
  setHeaders(proxyReq, req) {
    const defaultHeaders = {
      'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'X-Forwarded-For': req.ip,
      'X-Forwarded-Proto': req.protocol,
      'X-Forwarded-Host': req.get('host')
    };

    Object.entries(defaultHeaders).forEach(([key, value]) => {
      proxyReq.setHeader(key, value);
    });
  }
}