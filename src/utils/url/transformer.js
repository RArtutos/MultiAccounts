import { UrlValidator } from './validator.js';

export class UrlTransformer {
  constructor(account, targetDomain) {
    this.account = account;
    this.targetDomain = targetDomain;
    this.accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  }

  transform(url) {
    if (!url || typeof url !== 'string') return url;
    
    // No reescribir si ya tiene nuestro prefijo
    if (url.startsWith(this.accountPrefix)) {
      return url;
    }

    // No reescribir recursos estáticos
    if (UrlValidator.isStaticResource(url)) {
      return url;
    }

    try {
      // Convertir URLs absolutas
      if (UrlValidator.isAbsoluteUrl(url)) {
        const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
        
        // Si es una URL de Netflix, reescribirla
        if (UrlValidator.isInternalDomain(url, this.targetDomain)) {
          return `${this.accountPrefix}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
        }
        
        // Si no es de Netflix, mantener la URL original
        return url;
      }

      // Manejar URLs relativas
      if (url.startsWith('/')) {
        return `${this.accountPrefix}${url}`;
      }

      // URLs sin / inicial
      return `${this.accountPrefix}/${url}`;
    } catch (error) {
      console.error('Error transforming URL:', error);
      return url.startsWith('/') ? `${this.accountPrefix}${url}` : `${this.accountPrefix}/${url}`;
    }
  }
}