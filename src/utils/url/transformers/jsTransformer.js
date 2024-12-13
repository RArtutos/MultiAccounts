import { urlRewriter } from '../rewriters/urlRewriter.js';
import { patterns } from '../constants/patterns.js';

export class JsTransformer {
  constructor(account, targetDomain, req) {
    this.urlRewriter = new urlRewriter(account, targetDomain, req);
  }

  transform(content) {
    if (!content) return content;

    // Transform each JavaScript pattern
    return patterns.JS_PATTERNS.reduce((transformedContent, pattern) => {
      return transformedContent.replace(pattern, (match, prefix, url, suffix) => {
        const rewrittenUrl = this.urlRewriter.rewrite(url);
        return suffix ? 
          `${prefix}${rewrittenUrl}${suffix}` : 
          match.replace(url, rewrittenUrl);
      });
    }, content);
  }
}