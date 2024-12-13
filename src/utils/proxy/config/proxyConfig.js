import { getDefaultHeaders } from './headers.js';

export function createProxyConfig(account, req, targetDomain) {
  const headers = getDefaultHeaders(req.headers['user-agent']);
  const cookieString = account.cookies ? 
    Object.entries(account.cookies)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ') : 
    '';

  return {
    target: account.url,
    changeOrigin: true,
    secure: true,
    followRedirects: true,
    autoRewrite: true,
    ws: true,
    xfwd: true,
    cookieDomainRewrite: {
      '*': req.get('host')
    },
    cookiePathRewrite: {
      '*': '/'
    },
    headers: {
      ...headers,
      host: targetDomain,
      ...(cookieString && { cookie: cookieString })
    },
    onProxyRes: (proxyRes, req, res) => {
      // Remove problematic headers
      const headersToRemove = [
        'content-security-policy',
        'x-frame-options',
        'content-security-policy-report-only',
        'strict-transport-security',
        'x-content-type-options',
        'x-xss-protection'
      ];

      headersToRemove.forEach(header => {
        delete proxyRes.headers[header];
      });

      // Handle redirects
      if (proxyRes.headers.location) {
        const location = proxyRes.headers.location;
        if (location.startsWith('http')) {
          try {
            const url = new URL(location);
            if (url.hostname === targetDomain) {
              proxyRes.headers.location = `https://${req.get('host')}${url.pathname}${url.search}`;
            }
          } catch (error) {
            console.error('Error handling redirect:', error);
          }
        }
      }
    }
  };
}