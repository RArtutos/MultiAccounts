import { isInternalUrl } from './urlUtils.js';

export function rewriteUrls(content, account, targetDomain, req) {
  const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  const baseUrl = `${req.protocol}://${req.get('host')}`;

  // Función auxiliar para reescribir una URL
  function rewriteUrl(url) {
    if (!url) return url;

    // Si ya tiene nuestro prefijo, no la modificamos
    if (url.startsWith(accountPrefix)) {
      return url;
    }

    try {
      // Convertir URLs relativas a absolutas
      const absoluteUrl = url.startsWith('http') || url.startsWith('//')
        ? url
        : url.startsWith('/')
          ? `${account.url}${url}`
          : `${account.url}/${url}`;

      const urlObj = new URL(absoluteUrl);

      // Si es una URL interna, la reescribimos
      if (isInternalUrl(absoluteUrl, targetDomain)) {
        return `${accountPrefix}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
      }

      return url;
    } catch (error) {
      console.error('Error transforming URL:', error, url);
      return url;
    }
  }

  let modifiedContent = content;

  // Reescribir URLs en atributos HTML
  modifiedContent = modifiedContent.replace(
    /(href|src|action|data-src|poster)=["']([^"']+)["']/gi,
    (match, attr, url) => `${attr}="${rewriteUrl(url)}"`
  );

  // Reescribir URLs en meta refresh
  modifiedContent = modifiedContent.replace(
    /content=["'](\d*;\s*URL=)([^"']+)["']/gi,
    (match, prefix, url) => `content="${prefix}${rewriteUrl(url)}"`
  );

  // Reescribir URLs en CSS
  modifiedContent = modifiedContent.replace(
    /url\(['"]?([^'"\)]+)['"]?\)/gi,
    (match, url) => `url("${rewriteUrl(url)}")`
  );

  // Reescribir URLs en JavaScript
  const jsPatterns = [
    // Redirecciones directas
    /(window\.location|location|window\.location\.href|location\.href)\s*=\s*["']([^"']+)["']/gi,
    // Funciones de navegación
    /(window\.open|location\.replace|location\.assign)\(["']([^"']+)["']/gi,
    // Peticiones AJAX
    /(fetch|axios\.get|axios\.post|\.ajax)\(["']([^"']+)["']/gi
  ];

  jsPatterns.forEach(pattern => {
    modifiedContent = modifiedContent.replace(pattern, (match, func, url) => {
      return `${func}"${rewriteUrl(url)}"`;
    });
  });

  return modifiedContent;
}