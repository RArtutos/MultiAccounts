import { isInternalUrl, normalizeUrl } from './urlUtils.js';

export function rewriteUrls(html, account, targetDomain) {
  const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  
  // Lista de atributos que pueden contener URLs
  const urlAttributes = [
    'href',
    'src',
    'action',
    'data-url',
    'content',
    'data-src',
    'data-href',
    'poster',
    'formaction'
  ];

  let modifiedHtml = html;

  // Reemplazar URLs absolutas que usan el dominio del proxy
  const proxyUrlRegex = new RegExp(`https?:\/\/${req.get('host')}\/([^"'\\s>]*)`, 'gi');
  modifiedHtml = modifiedHtml.replace(proxyUrlRegex, (match, path) => {
    return `${accountPrefix}/${path}`;
  });

  // Reescribir URLs absolutas
  urlAttributes.forEach(attr => {
    const regex = new RegExp(`${attr}=["'](https?:\/\/[^"']*?)["']`, 'gi');
    modifiedHtml = modifiedHtml.replace(regex, (match, url) => {
      if (isInternalUrl(url, targetDomain)) {
        const normalizedUrl = normalizeUrl(url, targetDomain);
        const path = normalizedUrl.replace(/^https?:\/\/[^\/]+/, '');
        return `${attr}="${accountPrefix}${path}"`;
      }
      return match;
    });
  });

  // Reescribir URLs relativas
  urlAttributes.forEach(attr => {
    const relativeRegex = new RegExp(`${attr}=["'](\/?[^"'http][^"']*?)["']`, 'gi');
    modifiedHtml = modifiedHtml.replace(relativeRegex, (match, url) => {
      if (url.startsWith('//')) {
        if (isInternalUrl(url, targetDomain)) {
          return `${attr}="${accountPrefix}${url.replace(/^\/\/[^\/]+/, '')}"`;
        }
        return match;
      }
      return `${attr}="${accountPrefix}/${url.replace(/^\//, '')}"`;
    });
  });

  // Reescribir URLs en scripts
  const scriptPatterns = [
    // window.location y variantes
    {
      regex: /(?:window\.location|location)(?:\.href|\.pathname)?\s*=\s*["'](https?:\/\/[^"']*|\/[^"']*)["']/gi,
      handler: (match, url) => {
        if (isInternalUrl(url, targetDomain)) {
          const normalizedUrl = normalizeUrl(url, targetDomain);
          const path = normalizedUrl.replace(/^https?:\/\/[^\/]+/, '');
          return match.replace(url, `${accountPrefix}${path}`);
        }
        return match;
      }
    },
    // window.open y similares
    {
      regex: /(?:window\.open|location\.replace)\(["'](https?:\/\/[^"']*|\/[^"']*)["']/gi,
      handler: (match, url) => {
        if (isInternalUrl(url, targetDomain)) {
          const normalizedUrl = normalizeUrl(url, targetDomain);
          const path = normalizedUrl.replace(/^https?:\/\/[^\/]+/, '');
          return match.replace(url, `${accountPrefix}${path}`);
        }
        return match;
      }
    },
    // fetch/axios/XMLHttpRequest
    {
      regex: /(?:fetch|axios|\.open\(['"](?:GET|POST|PUT|DELETE)["'],\s*)["'](https?:\/\/[^"']*|\/[^"']*)["']/gi,
      handler: (match, url) => {
        if (isInternalUrl(url, targetDomain)) {
          const normalizedUrl = normalizeUrl(url, targetDomain);
          const path = normalizedUrl.replace(/^https?:\/\/[^\/]+/, '');
          return match.replace(url, `${accountPrefix}${path}`);
        }
        return match;
      }
    },
    // URLs en strings de JavaScript
    {
      regex: /["'](https?:\/\/[^"']*|\/[^"']*)["']/g,
      handler: (match, url) => {
        if (isInternalUrl(url, targetDomain)) {
          const normalizedUrl = normalizeUrl(url, targetDomain);
          const path = normalizedUrl.replace(/^https?:\/\/[^\/]+/, '');
          return match.replace(url, `${accountPrefix}${path}`);
        }
        return match;
      }
    }
  ];

  // Aplicar patrones de script
  scriptPatterns.forEach(({ regex, handler }) => {
    modifiedHtml = modifiedHtml.replace(regex, handler);
  });

  // Reescribir meta refresh
  modifiedHtml = modifiedHtml.replace(
    /content=["'](\d*;\s*URL=)(https?:\/\/[^"']*|\/[^"']*)["']/gi,
    (match, prefix, url) => {
      if (isInternalUrl(url, targetDomain)) {
        const normalizedUrl = normalizeUrl(url, targetDomain);
        const path = normalizedUrl.replace(/^https?:\/\/[^\/]+/, '');
        return `content="${prefix}${accountPrefix}${path}"`;
      }
      return match;
    }
  );

  // Reescribir URLs en estilos inline
  modifiedHtml = modifiedHtml.replace(
    /url\(['"]?(https?:\/\/[^'")\s]+|\/[^'")\s]+)['"]?\)/gi,
    (match, url) => {
      if (isInternalUrl(url, targetDomain)) {
        const normalizedUrl = normalizeUrl(url, targetDomain);
        const path = normalizedUrl.replace(/^https?:\/\/[^\/]+/, '');
        return `url("${accountPrefix}${path}")`;
      }
      return match;
    }
  );

  // Reescribir URLs en atributos data-* dinámicos
  modifiedHtml = modifiedHtml.replace(
    /data-[a-zA-Z0-9-]+=["'](https?:\/\/[^"']*|\/[^"']*)["']/gi,
    (match, url) => {
      if (isInternalUrl(url, targetDomain)) {
        const normalizedUrl = normalizeUrl(url, targetDomain);
        const path = normalizedUrl.replace(/^https?:\/\/[^\/]+/, '');
        return match.replace(url, `${accountPrefix}${path}`);
      }
      return match;
    }
  );

  return modifiedHtml;
}