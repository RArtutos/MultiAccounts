export function isInternalUrl(url, targetDomain) {
  try {
    if (url.startsWith('/')) return true;
    
    const urlToCheck = url.startsWith('//') ? `https:${url}` : url;
    const urlObj = new URL(urlToCheck);
    const hostname = urlObj.hostname;
    
    return hostname === targetDomain || 
           hostname.endsWith(`.${targetDomain}`) || 
           targetDomain.endsWith(`.${hostname}`);
  } catch {
    return !url.includes('://');
  }
}

export function normalizeUrl(url) {
  try {
    const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
    return urlObj.pathname + urlObj.search + urlObj.hash;
  } catch (error) {
    console.error('Error normalizing URL:', error);
    return url.startsWith('/') ? url : `/${url}`;
  }
}