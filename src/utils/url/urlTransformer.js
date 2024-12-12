import { isInternalUrl } from './urlValidator.js';
import { normalizeUrl } from './urlNormalizer.js';

export class UrlTransformer {
  constructor(account, targetDomain) {
    this.account = account;
    this.targetDomain = targetDomain;
    this.accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  }

  transform(url) {
    if (!url) return url;
    
    // Si ya tiene nuestro prefijo, no la modificamos
    if (url.startsWith(this.accountPrefix)) {
      return url;
    }

    // Para URLs absolutas que empiezan con /
    if (url.startsWith('/')) {
      return `${this.accountPrefix}${url}`;
    }

    // Para URLs con protocolo
    if (url.startsWith('http') || url.startsWith('//')) {
      const fullUrl = url.startsWith('//') ? `https:${url}` : url;
      if (isInternalUrl(fullUrl, this.targetDomain)) {
        const normalizedPath = normalizeUrl(fullUrl);
        return `${this.accountPrefix}${normalizedPath}`;
      }
      return url;
    }

    // Para URLs relativas
    return `${this.accountPrefix}/${url}`;
  }
}