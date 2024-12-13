import { getProxyBaseUrl } from './urlUtils.js';

export class UrlRewriter {
  constructor(account, req) {
    this.account = account;
    this.req = req;
    this.proxyBaseUrl = getProxyBaseUrl(req);
    this.accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
    this.targetDomain = new URL(account.url).hostname;
  }

  rewrite(url) {
    if (!url || typeof url !== 'string') return url;

    // No reescribir recursos estáticos
    if (this.isStaticResource(url)) {
      return url;
    }

    try {
      // Convertir URLs relativas a absolutas
      const absoluteUrl = this.makeAbsolute(url);
      const urlObj = new URL(absoluteUrl);

      // Si la URL es del dominio objetivo, reescribirla
      if (this.isTargetDomain(urlObj.hostname)) {
        return `${this.proxyBaseUrl}${this.accountPrefix}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
      }

      return url;
    } catch (error) {
      console.error('Error rewriting URL:', error);
      // Si hay error, asegurarse de que la URL apunte al proxy
      return `${this.proxyBaseUrl}${this.accountPrefix}/${url.replace(/^\//, '')}`;
    }
  }

  makeAbsolute(url) {
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return `https://${this.targetDomain}${url}`;
    return `https://${this.targetDomain}/${url}`;
  }

  isTargetDomain(hostname) {
    return hostname === this.targetDomain || 
           hostname.endsWith(`.${this.targetDomain}`) || 
           this.targetDomain.endsWith(`.${hostname}`);
  }

  isStaticResource(url) {
    return /\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot|ico)(\?.*)?$/i.test(url);
  }
}