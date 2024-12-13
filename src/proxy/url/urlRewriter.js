export class UrlRewriter {
  rewriteUrl(url, account, targetDomain) {
    if (!url || typeof url !== 'string') return url;

    const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;

    try {
      // No reescribir si ya tiene nuestro prefijo
      if (url.startsWith(accountPrefix)) {
        return url;
      }

      // No reescribir recursos estáticos
      if (this.isStaticResource(url)) {
        return url;
      }

      // Manejar URLs absolutas
      if (url.startsWith('http') || url.startsWith('//')) {
        const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
        if (this.isInternalDomain(urlObj.hostname, targetDomain)) {
          return `${accountPrefix}${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
        }
        return url;
      }

      // Manejar URLs relativas
      if (url.startsWith('/')) {
        return `${accountPrefix}${url}`;
      }

      // URLs relativas sin /
      return `${accountPrefix}/${url}`;
    } catch (error) {
      console.error('Error reescribiendo URL:', error);
      return url;
    }
  }

  rewritePath(path, req, account) {
    if (!path || !account) return path;

    const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
    
    try {
      // Si la URL ya tiene nuestro prefijo, extraer la ruta original
      if (path.startsWith(accountPrefix)) {
        const originalPath = path.slice(accountPrefix.length) || '/';
        if (req) {
          req.originalPath = originalPath;
        }
        return originalPath;
      }
      
      // Si es una ruta absoluta sin prefijo, añadir el prefijo
      if (path.startsWith('/') && !this.isStaticResource(path)) {
        return `${accountPrefix}${path}`;
      }
      
      return path;
    } catch (error) {
      console.error('Error reescribiendo path:', error);
      return path;
    }
  }

  isStaticResource(url) {
    return /\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot)(\?.*)?$/i.test(url);
  }

  isInternalDomain(hostname, targetDomain) {
    return hostname === targetDomain || 
           hostname.endsWith(`.${targetDomain}`) || 
           targetDomain.endsWith(`.${hostname}`);
  }
}