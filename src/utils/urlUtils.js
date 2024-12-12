export function getServiceDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (error) {
    console.error('Invalid URL:', error);
    return null;
  }
}

export function isInternalUrl(url, targetDomain) {
  try {
    // Manejar URLs relativas
    if (url.startsWith('/')) return true;
    
    // Manejar URLs con protocolo relativo
    if (url.startsWith('//')) {
      url = `https:${url}`;
    }
    
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const hostname = urlObj.hostname;
    
    // Comprobar si la URL es del dominio objetivo o sus subdominios
    return hostname === targetDomain || 
           hostname.endsWith(`.${targetDomain}`) || 
           targetDomain.endsWith(`.${hostname}`) ||
           // Comprobar dominios alternativos (por ejemplo, para Netflix)
           hostname.includes(targetDomain.split('.')[0]);
  } catch {
    // Si no se puede parsear la URL, asumimos que es relativa
    return !url.includes('://');
  }
}

export function normalizeUrl(url, targetDomain) {
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  if (url.startsWith('/')) {
    return `https://${targetDomain}${url}`;
  }
  if (!url.startsWith('http')) {
    return `https://${targetDomain}/${url.replace(/^\//, '')}`;
  }
  return url;
}