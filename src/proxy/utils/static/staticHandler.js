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

  shouldTransform(contentType) {
    if (!contentType) return false;
    
    return contentType.includes('text/html') || 
           contentType.includes('javascript') ||
           contentType.includes('application/json');
  }
}