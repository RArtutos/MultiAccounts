export class PathParser {
  static getPathFromUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search + urlObj.hash;
    } catch {
      return url;
    }
  }

  static normalizePath(path) {
    // Remove double slashes and normalize path
    return path
      .replace(/\/+/g, '/')  // Replace multiple slashes with single slash
      .replace(/\/$/, '');   // Remove trailing slash
  }

  static joinPaths(...paths) {
    return paths
      .map(path => path.replace(/^\/|\/$/g, ''))
      .filter(Boolean)
      .join('/');
  }
}