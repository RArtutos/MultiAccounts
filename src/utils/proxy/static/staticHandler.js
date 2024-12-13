export class StaticHandler {
  constructor() {
    this.staticExtensions = new Set([
      'css', 'js', 'jpg', 'jpeg', 'png', 'gif', 
      'svg', 'webp', 'woff', 'woff2', 'ttf', 'eot',
      'ico', 'mp4', 'webm', 'mp3', 'wav'
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
    
    const type = contentType.toLowerCase();
    return type.includes('text/html') || 
           type.includes('javascript') ||
           type.includes('application/json') ||
           type.includes('text/plain') ||
           type.includes('application/x-www-form-urlencoded');
  }
}