export class StaticHandler {
  constructor() {
    this.staticExtensions = new Set([
      'css', 'js', 'jpg', 'jpeg', 'png', 'gif', 
      'svg', 'webp', 'woff', 'woff2', 'ttf', 'eot'
    ]);
  }

  isStaticResource(url) {
    try {
      const extension = url.split('.').pop().split('?')[0].toLowerCase();
      return this.staticExtensions.has(extension);
    } catch {
      return false;
    }
  }

  shouldTransform(contentType, url) {
    if (!contentType) return false;
    
    // No transformar recursos estáticos
    if (this.isStaticResource(url)) return false;

    // Solo transformar HTML y JavaScript
    return contentType.includes('text/html') || 
           contentType.includes('javascript');
  }
}