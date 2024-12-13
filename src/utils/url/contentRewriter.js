import { UrlRewriter } from './urlRewriter.js';

export class ContentRewriter {
  constructor(account, req) {
    this.urlRewriter = new UrlRewriter(account, req);
  }

  rewrite(content) {
    if (!content) return content;

    // Reescribir atributos HTML
    content = this.rewriteHtmlAttributes(content);

    // Reescribir JavaScript
    content = this.rewriteJavaScript(content);

    // Reescribir meta refresh
    content = this.rewriteMetaRefresh(content);

    // Reescribir URLs en estilos inline
    content = this.rewriteInlineStyles(content);

    return content;
  }

  rewriteHtmlAttributes(content) {
    return content.replace(
      /(href|src|action|data-src|poster|formaction|data-url|data-href)=["']([^"']+)["']/gi,
      (match, attr, url) => `${attr}="${this.urlRewriter.rewrite(url)}"`
    );
  }

  rewriteJavaScript(content) {
    const patterns = [
      // Redirecciones directas
      /(window\.location|location|window\.location\.href|location\.href)\s*=\s*["']([^"']+)["']/gi,
      // Funciones de navegación
      /(window\.open|location\.replace|location\.assign|navigate|history\.pushState.*?|history\.replaceState.*?)\(["']([^"']+)["']/gi,
      // AJAX y Fetch
      /(fetch|axios\.get|axios\.post|\.ajax)\(["']([^"']+)["']/gi,
      // URLs en strings
      /(['"])(https?:\/\/[^'"]+|\/[^'"]+)(['"])/g,
      // URLs sin comillas
      /:\s*(\/(api|auth|login|logout|lt|[a-zA-Z0-9-]+)\/[a-zA-Z0-9-\/]*)/g
    ];

    return patterns.reduce((content, pattern) => {
      return content.replace(pattern, (match, prefix, url, suffix) => {
        if (!url || this.urlRewriter.isStaticResource(url)) return match;
        const rewrittenUrl = this.urlRewriter.rewrite(url);
        return suffix ? `${prefix}${rewrittenUrl}${suffix}` : match.replace(url, rewrittenUrl);
      });
    }, content);
  }

  rewriteMetaRefresh(content) {
    return content.replace(
      /content=["'](\d*;\s*URL=)([^"']+)["']/gi,
      (match, prefix, url) => `content="${prefix}${this.urlRewriter.rewrite(url)}"`
    );
  }

  rewriteInlineStyles(content) {
    return content.replace(
      /url\(['"]?([^'")]+)['"]?\)/gi,
      (match, url) => `url('${this.urlRewriter.rewrite(url)}')`
    );
  }
}