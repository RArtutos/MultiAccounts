import { urlPatterns } from './patterns.js';
import { UrlTransformer } from './transformer.js';

export function rewriteUrls(content, account, targetDomain) {
  if (!content || !account) return content;

  const transformer = new UrlTransformer(account, targetDomain);

  // Reescribir atributos HTML
  content = content.replace(
    urlPatterns.HTML_ATTRIBUTES,
    (match, attr, url) => `${attr}="${transformer.transform(url)}"`
  );

  // Reescribir meta refresh
  content = content.replace(
    urlPatterns.META_REFRESH,
    (match, prefix, url) => `content="${prefix}${transformer.transform(url)}"`
  );

  // Reescribir redirecciones JavaScript
  content = content.replace(
    urlPatterns.JS_REDIRECTS,
    (match, prefix, url) => `${prefix}="${transformer.transform(url)}"`
  );

  // Reescribir navegación JavaScript
  content = content.replace(
    urlPatterns.JS_NAVIGATION,
    (match, prefix, url) => `${prefix}("${transformer.transform(url)}"`
  );

  // Reescribir AJAX
  content = content.replace(
    urlPatterns.JS_AJAX,
    (match, prefix, url) => `${prefix}("${transformer.transform(url)}"`
  );

  // Reescribir URLs en strings
  content = content.replace(
    urlPatterns.JS_STRING_URLS,
    (match, prefix, url, suffix) => `${prefix}${transformer.transform(url)}${suffix}`
  );

  // Reescribir URLs en estilos inline
  content = content.replace(
    urlPatterns.INLINE_STYLES,
    (match, url) => `url('${transformer.transform(url)}')`
  );

  return content;
}