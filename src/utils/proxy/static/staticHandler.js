export class StaticHandler {
  constructor() {
    this.staticExtensions = new Set([
      // Imágenes
      'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'bmp',
      // Fuentes
      'woff', 'woff2', 'ttf', 'eot', 'otf',
      // Media
      'mp4', 'webm', 'mp3', 'wav',
      // Recursos web
      'css', 'js', 'json'
    ]);

    this.transformableTypes = new Set([
      'text/html',
      'application/javascript',
      'text/javascript'
    ]);
  }

  isStaticResource(url = '') {
    try {
      const extension = url.split('.').pop().split('?')[0].toLowerCase();
      return this.staticExtensions.has(extension);
    } catch {
      return false;
    }
  }

  shouldTransform(contentType = '', url = '') {
    if (!contentType || this.isStaticResource(url)) {
      return false;
    }

    const baseType = contentType.split(';')[0].toLowerCase();
    return this.transformableTypes.has(baseType);
  }
}