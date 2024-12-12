import { UrlTransformer } from './url/urlTransformer.js';
import { AttributeRewriter } from './html/attributeRewriter.js';
import { ScriptRewriter } from './html/scriptRewriter.js';

export function rewriteUrls(html, account, targetDomain, req) {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  
  const urlTransformer = new UrlTransformer(account, targetDomain, baseUrl, accountPrefix);
  const attributeRewriter = new AttributeRewriter(urlTransformer);
  const scriptRewriter = new ScriptRewriter(urlTransformer);

  let modifiedHtml = html;

  // Reescribir URLs en atributos
  modifiedHtml = attributeRewriter.rewrite(modifiedHtml);

  // Reescribir URLs en scripts
  modifiedHtml = scriptRewriter.rewrite(modifiedHtml);

  // Reescribir meta refresh
  modifiedHtml = modifiedHtml.replace(
    /content=["'](\d*;\s*URL=)([^"']+)["']/gi,
    (match, prefix, url) => `content="${prefix}${urlTransformer.transform(url)}"`
  );

  // Reescribir URLs en estilos
  modifiedHtml = modifiedHtml.replace(
    /url\(['"]?([^'")\s]+)['"]?\)/gi,
    (match, url) => `url("${urlTransformer.transform(url)}")`
  );

  // Reescribir URLs absolutas en el HTML
  modifiedHtml = modifiedHtml.replace(
    /(href|src|action)=["'](https?:\/\/[^"']+)["']/gi,
    (match, attr, url) => {
      if (url.includes(targetDomain)) {
        return `${attr}="${urlTransformer.transform(url)}"`;
      }
      return match;
    }
  );

  return modifiedHtml;
}