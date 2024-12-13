import { urlRewriter } from '../rewriters/urlRewriter.js';
import { patterns } from '../constants/patterns.js';

export class HtmlTransformer {
  constructor(account, targetDomain, req) {
    this.urlRewriter = new urlRewriter(account, targetDomain, req);
  }

  transform(content) {
    if (!content) return content;

    // Transform HTML attributes
    content = content.replace(
      patterns.HTML_ATTRIBUTES,
      (match, attr, url) => `${attr}="${this.urlRewriter.rewrite(url)}"`
    );

    // Transform meta refresh
    content = content.replace(
      patterns.META_REFRESH,
      (match, prefix, url) => `content="${prefix}${this.urlRewriter.rewrite(url)}"`
    );

    return content;
  }
}