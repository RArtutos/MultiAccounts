export function isInternalUrl(url, targetDomain) {
  try {
    if (url.startsWith('/')) return true;
    
    const urlToCheck = url.startsWith('//') ? `https:${url}` : url;
    const urlObj = new URL(urlToCheck);
    const hostname = urlObj.hostname;
    
    // Comparación más estricta de dominios
    return hostname === targetDomain || 
           hostname.endsWith(`.${targetDomain}`) || 
           targetDomain.endsWith(`.${hostname}`);
  } catch {
    return !url.includes('://');
  }
}