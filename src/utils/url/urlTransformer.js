import { isInternalUrl } from './urlValidator.js';
import { normalizeUrl } from './urlNormalizer.js';

export class UrlTransformer {
  constructor(account, targetDomain, baseUrl, accountPrefix) {
    this.account = account;
    this.targetDomain = targetDomain;
    this.baseUrl = baseUrl;
    this.accountPrefix = accountPrefix;
  }

  transform(url) {
    if (!url) return url;
    
    // Si ya tiene nuestro prefijo, no la modificamos
    if (url.startsWith(this.accountPrefix)) {
      return url;
    }

    try {
      // Convertir URLs relativas a absolutas
      const absoluteUrl = url.startsWith('http') || url.startsWith('//')
        ? url
        : url.startsWith('/')
          ? `${this.baseUrl}${url}`
          : `${this.baseUrl}/${url}`;

      const urlObj = new URL(absoluteUrl);

      // Si es una URL interna, la reescribimos
      if (isInternalUrl(absoluteUrl, this.targetDomain)) {
        const path = urlObj.pathname + urlObj.search + urlObj.hash;
        return `${this.accountPrefix}${path}`;
      }

      return url;
    } catch (error) {
      console.error('Error transforming URL:', error);
      // Para URLs que no se pueden parsear, las dejamos como están
      return url;
    }
  }
}