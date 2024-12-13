export class RedirectHandler {
  constructor(account, targetDomain) {
    this.account = account;
    this.targetDomain = targetDomain;
    this.accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
  }

  handleRedirect(location) {
    if (!location) return location;

    try {
      // No modificar URLs de recursos estáticos
      if (location.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot)(\?.*)?$/i)) {
        return location;
      }

      // Si la URL ya tiene nuestro prefijo, no la modificamos
      if (location.startsWith(this.accountPrefix)) {
        return location;
      }

      // Manejar URLs absolutas (con protocolo o //)
      if (location.startsWith('http') || location.startsWith('//')) {
        const locationUrl = new URL(location.startsWith('//') ? `https:${location}` : location);
        
        // Solo reescribir si es del mismo dominio
        if (this.isInternalDomain(locationUrl.hostname)) {
          const path = locationUrl.pathname + locationUrl.search + locationUrl.hash;
          return path.startsWith(this.accountPrefix) ? path : `${this.accountPrefix}${path}`;
        }
        return location;
      }

      // Manejar URLs relativas
      const cleanPath = location.startsWith('/') ? location : `/${location}`;
      return cleanPath.startsWith(this.accountPrefix) ? cleanPath : `${this.accountPrefix}${cleanPath}`;

    } catch (error) {
      console.error('Error handling redirect:', error);
      return location;
    }
  }

  isInternalDomain(hostname) {
    return hostname === this.targetDomain || 
           hostname.endsWith(`.${this.targetDomain}`) || 
           this.targetDomain.endsWith(`.${hostname}`);
  }
}