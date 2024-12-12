import { CookieHandler } from './cookieHandler.js';

export function createProxyConfig(account, req, targetDomain) {
  const cookieHandler = new CookieHandler(account);
  const accountPath = `/stream/${encodeURIComponent(account.name)}`;
  
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
    onProxyReq: (proxyReq, req) => {
      try {
        // Establecer headers primero
        const headers = {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'X-Forwarded-For': req.ip,
          'X-Forwarded-Proto': req.protocol,
          'X-Forwarded-Host': req.get('host')
        };

        // Establecer headers base
        Object.entries(headers).forEach(([key, value]) => {
          if (!proxyReq.getHeader(key)) {
            proxyReq.setHeader(key, value);
          }
        });

        // Inyectar cookies después
        const accountCookies = cookieHandler.getAccountCookies();
        if (accountCookies) {
          const existingCookie = proxyReq.getHeader('cookie') || '';
          if (!existingCookie.includes(accountCookies)) {
            proxyReq.setHeader(
              'cookie',
              existingCookie ? `${existingCookie}; ${accountCookies}` : accountCookies
            );
          }
        }
      } catch (error) {
        console.error('Error en onProxyReq:', error);
      }
    },
    pathRewrite: (path) => {
      // No reescribir recursos estáticos
      if (path.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot)(\?.*)?$/i)) {
        return path;
      }

      // Si la URL ya tiene nuestro prefijo, extraer la parte real
      if (path.startsWith(accountPath)) {
        return path.slice(accountPath.length) || '/';
      }
      return path;
    }
  };
}