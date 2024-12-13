export class UrlValidator {
  static isStaticResource(url) {
    const STATIC_PATTERN = /\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot|ico)(\?.*)?$/i;
    return STATIC_PATTERN.test(url);
  }

  static isInternalDomain(url, targetDomain) {
    try {
      if (!url || !targetDomain) return false;
      const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
      const hostname = urlObj.hostname;
      return hostname === targetDomain || 
             hostname.endsWith(`.${targetDomain}`) || 
             targetDomain.endsWith(`.${hostname}`);
    } catch {
      return false;
    }
  }

  static isAbsoluteUrl(url) {
    return url.startsWith('http') || url.startsWith('https') || url.startsWith('//');
  }
}