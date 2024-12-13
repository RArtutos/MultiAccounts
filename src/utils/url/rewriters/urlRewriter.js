import { AbsoluteUrlRewriter } from './absoluteUrlRewriter.js';
import { RelativeUrlRewriter } from './relativeUrlRewriter.js';
import { UrlValidator } from '../validators/urlValidator.js';
import { UrlParser } from '../parsers/urlParser.js';

export class urlRewriter {
  constructor(account, targetDomain, req) {
    this.absoluteRewriter = new AbsoluteUrlRewriter(account, targetDomain);
    this.relativeRewriter = new RelativeUrlRewriter(account, req);
    this.accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  }

  rewrite(url) {
    if (!url || typeof url !== 'string') return url;
    
    // Don't rewrite if already has our prefix
    if (url.startsWith(this.accountPrefix)) {
      return url;
    }

    // Don't rewrite static resources
    if (UrlValidator.isStaticResource(url)) {
      return url;
    }

    try {
      // Handle absolute URLs
      if (url.startsWith('http') || url.startsWith('//')) {
        return this.absoluteRewriter.rewrite(url);
      }

      // Handle relative URLs
      return this.relativeRewriter.rewrite(url);
    } catch (error) {
      console.error('Error rewriting URL:', error);
      return url;
    }
  }
}