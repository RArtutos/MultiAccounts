import { isInternalUrl } from './urlUtils.js';

export function rewriteUrls(content, account, targetDomain, req) {
  if (!content || !account) return content;

  const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  const baseUrl = account.url.replace(/\/$/, '');

  function rewriteUrl(url) {
    if (!url || typeof url !== 'string') return url;

    // No reescribir si ya tiene nuestro prefijo
    if (url.startsWith(accountPrefix)) {
      return url;
    }

    // No reescribir recursos estáticos
    if (url.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot|ico)(\?.*)?$/i)) {
      return url;
    }

    try {
      // Manejar URLs absolutas
      if (url.startsWith('http') || url.startsWith('//')) {
        const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
        if (isInternalUrl(url, targetDomain)) {
          return `${accountPrefix}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
        }
        return url;
      }

      // Manejar URLs que empiezan con /
      if (url.startsWith('/')) {
        return `${accountPrefix}${url}`;
      }

      // Manejar URLs relativas sin /
      const currentPath = req?.originalPath || '/';
      const currentDir = currentPath.split('/').slice(0, -1).join('/');
      const resolvedPath = new URL(url, `${baseUrl}${currentDir}/`).pathname;
      return `${accountPrefix}${resolvedPath}`;

    } catch (error) {
      console.error('Error transforming URL:', error);
      // Si hay error, asegurarnos de que al menos tenga el prefijo
      return url.startsWith('/') ? `${accountPrefix}${url}` : `${accountPrefix}/${url}`;
    }
  }

  // Reescribir URLs en atributos HTML
  content = content.replace(
    /(href|src|action|data-src|poster|formaction|data-url|data-href)=["']([^"']+)["']/gi,
    (match, attr, url) => `${attr}="${rewriteUrl(url)}"`
  );

  // Reescribir URLs en meta refresh
  content = content.replace(
    /content=["'](\d*;\s*URL=)([^"']+)["']/gi,
    (match, prefix, url) => `content="${prefix}${rewriteUrl(url)}"`
  );

  // Reescribir URLs en JavaScript
  const jsPatterns = [
    // Redirecciones directas
    /(window\.location|location|window\.location\.href|location\.href)\s*=\s*["']([^"']+)["']/gi,
    // Funciones de navegación
    /(window\.open|location\.replace|location\.assign|navigate|history\.pushState.*?|history\.replaceState.*?)\(["']([^"']+)["']/gi,
    // AJAX y Fetch
    /(fetch|axios\.get|axios\.post|\.ajax)\(["']([^"']+)["']/gi,
    // URLs en strings
    /(['"])(\/[^'"]+)(['"])/g,
    // URLs sin comillas en JavaScript
    /:\s*(\/(api|auth|login|logout|lt|[a-zA-Z0-9-]+)\/[a-zA-Z0-9-\/]*)/g
  ];

  jsPatterns.forEach(pattern => {
    content = content.replace(pattern, (match, prefix, url, suffix) => {
      if (!url || url.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot|ico)(\?.*)?$/i)) {
        return match;
      }
      const rewrittenUrl = rewriteUrl(url);
      return suffix ? `${prefix}${rewrittenUrl}${suffix}` : match.replace(url, rewrittenUrl);
    });
  });

  // Reescribir URLs en estilos inline
  content = content.replace(
    /url\(['"]?([^'")]+)['"]?\)/gi,
    (match, url) => `url('${rewriteUrl(url)}')`
  );

  return content;
}