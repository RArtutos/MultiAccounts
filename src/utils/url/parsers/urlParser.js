export class UrlParser {
  static parse(url) {
    if (!url || typeof url !== 'string') return null;

    try {
      // Handle protocol-relative URLs
      if (url.startsWith('//')) {
        return new URL(`https:${url}`);
      }
      
      // Handle absolute URLs
      if (url.startsWith('http')) {
        return new URL(url);
      }

      // Handle relative URLs
      return null;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return null;
    }
  }

  static normalize(url, baseUrl) {
    try {
      return new URL(url, baseUrl).toString();
    } catch {
      return url;
    }
  }
}