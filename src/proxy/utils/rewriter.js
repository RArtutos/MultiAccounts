import { UrlUtils } from './url.js';
import { StaticHandler } from './static.js';

export class UrlRewriter {
  constructor(account, targetDomain) {
    this.account = account;
    this.targetDomain = targetDomain;
    this.accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  }

  rewrite(url) {
    if (!url || typeof url !== 'string') return url;
    
    // No reescribir si ya tiene nuestro prefijo
    if (url.startsWith(this.accountPrefix)) {
      return url;
    }

    // No reescribir recursos estáticos
    if (StaticHandler.isStaticResource(url)) {
      return url;
    }

    try {
      // Manejar URLs absolutas
      if (url.startsWith('http') || url.startsWith('//')) {
        if (UrlUtils.isInternalUrl(url, this.targetDomain)) {
          const normalizedPath = UrlUtils.normalizeUrl(url);
          return `${this.accountPrefix}${normalizedPath}`;
        }
        return url;
      }

      // Manejar URLs relativas
      if (url.startsWith('/')) {
        return `${this.accountPrefix}${url}`;
      }

      // URLs sin / inicial
      return `${this.accountPrefix}/${url}`;
    } catch (error) {
      console.error('Error rewriting URL:', error);
      return url;
    }
  }
}