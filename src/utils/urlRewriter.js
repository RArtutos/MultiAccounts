import { isInternalUrl, normalizeUrl } from './urlUtils.js';

export function rewriteUrls(html, account, targetDomain, req) {
  const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;

  function rewriteUrl(url) {
    if (!url) return url;
    
    // Si ya tiene nuestro prefijo, no la modificamos
    if (url.startsWith(accountPrefix)) {
      return url;
    }

    // Siempre reescribir URLs que empiezan con /
    if (url.startsWith('/')) {
      const cleanUrl = url.replace(/^\/+/, '');
      return `${accountPrefix}/${cleanUrl}`;
    }

    // Limpiar la URL de múltiples slashes
    const cleanUrl = url.replace(/^\/+/, '');

    // Si es una URL absoluta con protocolo
    if (url.startsWith('http')) {
      if (isInternalUrl(url, targetDomain)) {
        const normalizedPath = normalizeUrl(url, targetDomain);
        return `${accountPrefix}${normalizedPath}`;
      }
      return url;
    }

    // Si es una URL con protocolo relativo
    if (url.startsWith('//')) {
      const fullUrl = `https:${url}`;
      if (isInternalUrl(fullUrl, targetDomain)) {
        const normalizedPath = normalizeUrl(fullUrl, targetDomain);
        return `${accountPrefix}${normalizedPath}`;
      }
      return url;
    }

    // Para cualquier otra URL, asumimos que es relativa
    return `${accountPrefix}/${cleanUrl}`;
  }

  let modifiedHtml = html;

  // Reescribir atributos con URLs - Expresión regular más estricta
  const urlAttributes = ['href', 'src', 'action', 'data-url', 'content', 'data-src', 'data-href', 'poster', 'formaction'];
  
  urlAttributes.forEach(attr => {
    // Expresión regular mejorada para capturar URLs con y sin comillas
    const regex = new RegExp(`${attr}=(?:["']([^"']+)["']|([^ >]+))`, 'gi');
    modifiedHtml = modifiedHtml.replace(regex, (match, quotedUrl, unquotedUrl) => {
      const url = quotedUrl || unquotedUrl;
      const rewrittenUrl = rewriteUrl(url);
      return `${attr}="${rewrittenUrl}"`;
    });
  });

  // Reescribir scripts y redirecciones con una expresión más inclusiva
  const scriptPatterns = [
    {
      regex: /(?:window\.location|location|window\.location\.href|location\.href)\s*=\s*["']([^"']+)["']/gi,
      handler: (match, url) => match.replace(url, rewriteUrl(url))
    },
    {
      regex: /(?:window\.open|location\.replace|location\.assign)\(["']([^"']+)["']/gi,
      handler: (match, url) => match.replace(url, rewriteUrl(url))
    },
    {
      regex: /(?:fetch|axios|\.open\(['"](?:GET|POST|PUT|DELETE|PATCH)["'],\s*)["']([^"']+)["']/gi,
      handler: (match, url) => match.replace(url, rewriteUrl(url))
    },
    // Capturar asignaciones de URL sin comillas
    {
      regex: /(?:window\.location|location|window\.location\.href|location\.href)\s*=\s*([^"'\s;]+)/gi,
      handler: (match, url) => match.replace(url, rewriteUrl(url))
    }
  ];

  scriptPatterns.forEach(({ regex, handler }) => {
    modifiedHtml = modifiedHtml.replace(regex, handler);
  });

  // Reescribir meta refresh con una expresión más precisa
  modifiedHtml = modifiedHtml.replace(
    /content=["'](\d*;\s*URL=)([^"']+)["']/gi,
    (match, prefix, url) => `content="${prefix}${rewriteUrl(url)}"`
  );

  // Reescribir URLs en estilos con una expresión más inclusiva
  modifiedHtml = modifiedHtml.replace(
    /url\(['"]?([^'")\s]+)['"]?\)/gi,
    (match, url) => `url("${rewriteUrl(url)}")`
  );

  // Reescribir URLs en atributos data-* personalizados
  modifiedHtml = modifiedHtml.replace(
    /data-[a-zA-Z0-9-]+=["']([^"']+)["']/gi,
    (match, url) => {
      if (url.startsWith('/') || url.startsWith('http') || url.startsWith('//')) {
        return match.replace(url, rewriteUrl(url));
      }
      return match;
    }
  );

  return modifiedHtml;
}
