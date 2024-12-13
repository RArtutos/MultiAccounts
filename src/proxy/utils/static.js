export class StaticHandler {
  static isStaticResource(url) {
    const STATIC_EXTENSIONS = [
      'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'css', 'js',
      'woff', 'woff2', 'ttf', 'eot', 'ico', 'mp4', 'webm'
    ];
    
    const pattern = new RegExp(`\\.(${STATIC_EXTENSIONS.join('|')})(?:\\?.*)?$`, 'i');
    return pattern.test(url);
  }

  static shouldTransform(contentType) {
    if (!contentType) return false;
    
    return contentType.includes('text/html') || 
           contentType.includes('javascript') ||
           contentType.includes('application/json');
  }
}