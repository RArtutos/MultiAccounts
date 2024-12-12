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
    const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
    return urlObj.hostname === targetDomain || urlObj.hostname.endsWith(`.${targetDomain}`);
  } catch {
    return url.startsWith('/');
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