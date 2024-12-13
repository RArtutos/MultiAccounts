export class UrlValidator {
  static isInternalDomain(hostname, targetDomain) {
    if (!hostname || !targetDomain) return false;
    
    return hostname === targetDomain || 
           hostname.endsWith(`.${targetDomain}`) || 
           targetDomain.endsWith(`.${hostname}`);
  }

  static isStaticResource(url) {
    return /\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot|ico|mp4|webm|mp3|wav)(\?.*)?$/i.test(url);
  }

  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}