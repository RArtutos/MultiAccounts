import { UrlParser } from '../parsers/urlParser.js';
import { UrlValidator } from '../validators/urlValidator.js';
import { PathParser } from '../parsers/pathParser.js';

export class AbsoluteUrlRewriter {
  constructor(account, targetDomain) {
    this.account = account;
    this.targetDomain = targetDomain;
    this.accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  }

  rewrite(url) {
    const parsedUrl = UrlParser.parse(url);
    if (!parsedUrl) return url;

    if (UrlValidator.isInternalDomain(parsedUrl.hostname, this.targetDomain)) {
      const path = PathParser.getPathFromUrl(url);
      return `${this.accountPrefix}${path}`;
    }

    return url;
  }
}