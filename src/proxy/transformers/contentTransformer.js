import { Transform } from 'stream';
import { UrlRewriter } from '../utils/rewriter.js';

export class ContentTransformer extends Transform {
  constructor(account, targetDomain) {
    super();
    this.urlRewriter = new UrlRewriter(account, targetDomain);
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    callback();
  }

  _flush(callback) {
    try {
      const transformed = this.transformContent(this.buffer);
      this.push(transformed);
      callback();
    } catch (error) {
      console.error('Error transforming content:', error);
      this.push(this.buffer);
      callback();
    }
  }

  transformContent(content) {
    if (!content) return content;

    // Reescribir atributos HTML
    content = this.rewriteHtmlAttributes(content);

    // Reescribir JavaScript
    content = this.rewriteJavaScript(content);

    // Reescribir meta refresh
    content = this.rewriteMetaRefresh(content);

    return content;
  }

  rewriteHtmlAttributes(content) {
    return content.replace(
      /(href|src|action|data-src|poster|formaction)=["']([^"']+)["']/gi,
      (match, attr, url) => `${attr}="${this.urlRewriter.rewrite(url)}"`
    );
  }

  rewriteJavaScript(content) {
    const patterns = [
      /(window\.location|location|window\.location\.href|location\.href)\s*=\s*["']([^"']+)["']/gi,
      /(window\.open|location\.replace|location\.assign)\(["']([^"']+)["']/gi,
      /(fetch|axios\.get|axios\.post|\.ajax)\(["']([^"']+)["']/gi
    ];

    return patterns.reduce((content, pattern) => {
      return content.replace(pattern, (match, prefix, url) => {
        const rewrittenUrl = this.urlRewriter.rewrite(url);
        return match.replace(url, rewrittenUrl);
      });
    }, content);
  }

  rewriteMetaRefresh(content) {
    return content.replace(
      /content=["'](\d*;\s*URL=)([^"']+)["']/gi,
      (match, prefix, url) => `content="${prefix}${this.urlRewriter.rewrite(url)}"`
    );
  }
}