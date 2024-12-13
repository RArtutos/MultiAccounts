import { PathParser } from '../parsers/pathParser.js';
import { UrlValidator } from '../validators/urlValidator.js';

export class RelativeUrlRewriter {
  constructor(account, req) {
    this.account = account;
    this.req = req;
    this.accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  }

  rewrite(url) {
    if (UrlValidator.isStaticResource(url)) return url;
    
    if (url.startsWith('/')) {
      return `${this.accountPrefix}${url}`;
    }

    // Handle relative paths without leading slash
    const currentPath = this.req?.originalPath || '/';
    const currentDir = PathParser.normalizePath(currentPath.split('/').slice(0, -1).join('/'));
    const resolvedPath = PathParser.normalizePath(`${currentDir}/${url}`);
    
    return `${this.accountPrefix}${resolvedPath}`;
  }
}