export function normalizeUrl(url) {
  try {
    const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
    return urlObj.pathname + urlObj.search + urlObj.hash;
  } catch (error) {
    console.error('Error normalizing URL:', error);
    return url.startsWith('/') ? url : `/${url}`;
  }
}