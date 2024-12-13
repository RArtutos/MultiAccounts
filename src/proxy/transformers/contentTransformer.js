import { Transform } from 'stream';
import { ContentTypes } from '../utils/contentTypes.js';

export class ContentTransformer extends Transform {
  constructor(account, req, urlRewriter) {
    super();
    this.account = account;
    this.req = req;
    this.urlRewriter = urlRewriter;
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
    // Transform HTML attributes
    content = this.transformHtmlAttributes(content);
    
    // Transform JavaScript
    content = this.transformJavaScript(content);
    
    // Transform meta refresh
    content = this.transformMetaRefresh(content);
    
    return content;
  }

  transformHtmlAttributes(content) {
    return content.replace(
      /(href|src|action|data-src|poster)=["']([^"']+)["']/gi,
      (match, attr, url) => {
        if (ContentTypes.isStaticResource(url)) return match;
        const rewrittenUrl = this.urlRewriter.rewriteUrl(url, this.account, this.req.originalPath);
        return `${attr}="${rewrittenUrl}"`;
      }
    );
  }

  transformJavaScript(content) {
    const patterns = [
      // Direct redirects
      /(window\.location|location|window\.location\.href|location\.href)\s*=\s*["']([^"']+)["']/gi,
      // Navigation functions
      /(window\.open|location\.replace|location\.assign)\(["']([^"']+)["']/gi,
      // AJAX requests
      /(fetch|axios\.get|axios\.post|\.ajax)\(["']([^"']+)["']/gi
    ];

    return patterns.reduce((transformedContent, pattern) => {
      return transformedContent.replace(pattern, (match, func, url) => {
        if (ContentTypes.isStaticResource(url)) return match;
        const rewrittenUrl = this.urlRewriter.rewriteUrl(url, this.account, this.req.originalPath);
        return `${func}"${rewrittenUrl}"`;
      });
    }, content);
  }

  transformMetaRefresh(content) {
    return content.replace(
      /content=["'](\d*;\s*URL=)([^"']+)["']/gi,
      (match, prefix, url) => {
        const rewrittenUrl = this.urlRewriter.rewriteUrl(url, this.account, this.req.originalPath);
        return `content="${prefix}${rewrittenUrl}"`;
      }
    );
  }
}