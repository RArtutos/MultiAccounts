export class UrlRewriteService {
  constructor(account) {
    this.account = account;
    this.accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  }

  rewriteUrl(url, req) {
    if (!url) return url;

    try {
      // Si la URL ya tiene nuestro prefijo, no la modificamos
      if (url.startsWith(this.accountPrefix)) {
        return url;
      }

      // Manejar URLs absolutas
      if (url.startsWith('http') || url.startsWith('//')) {
        const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
        const originalUrl = new URL(this.account.url);

        // Si el dominio coincide, reescribimos la URL
        if (urlObj.hostname === originalUrl.hostname) {
          return `${this.accountPrefix}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
        }
        return url;
      }

      // Manejar URLs relativas
      if (url.startsWith('/')) {
        return `${this.accountPrefix}${url}`;
      }

      // URLs relativas sin /
      return `${this.accountPrefix}/${url}`;
    } catch (error) {
      console.error('Error rewriting URL:', error);
      return url;
    }
  }

  rewritePath(path) {
    if (path.startsWith(this.accountPrefix)) {
      return path.slice(this.accountPrefix.length) || '/';
    }
    return path;
  }
}