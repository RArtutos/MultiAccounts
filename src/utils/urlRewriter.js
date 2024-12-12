import { UrlTransformer } from './url/urlTransformer.js';
import { AttributeRewriter } from './html/attributeRewriter.js';
import { ScriptRewriter } from './html/scriptRewriter.js';

export function rewriteUrls(html, account, targetDomain) {
  const urlTransformer = new UrlTransformer(account, targetDomain);
  const attributeRewriter = new AttributeRewriter(urlTransformer);
  const scriptRewriter = new ScriptRewriter(urlTransformer);

  // Aplicar las transformaciones en orden
  let modifiedHtml = html;
  modifiedHtml = attributeRewriter.rewrite(modifiedHtml);
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

  return modifiedHtml;
}