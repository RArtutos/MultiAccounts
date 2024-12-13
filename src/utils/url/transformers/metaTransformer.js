import { urlRewriter } from '../rewriters/urlRewriter.js';
import { patterns } from '../constants/patterns.js';

export class MetaTransformer {
  constructor(account, targetDomain, req) {
    this.urlRewriter = new urlRewriter(account, targetDomain, req);
  }

  transform(content) {
    if (!content) return content;

    return content.replace(
      patterns.META_TAGS,
      (match, prefix, url) => `${prefix}${this.urlRewriter.rewrite(url)}`
    );
  }
}