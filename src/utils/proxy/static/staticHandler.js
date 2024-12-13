import { STATIC_PATTERNS } from './staticPatterns.js';

export class StaticHandler {
  isStaticResource(url) {
    try {
      // Si no hay URL, no es un recurso estático
      if (!url) return false;

      // Comprobar patrones de recursos estáticos
      return STATIC_PATTERNS.some(pattern => pattern.test(url));
    } catch {
      return false;
    }
  }

  shouldTransform(contentType, url) {
    if (!contentType) return false;
    
    // No transformar recursos estáticos
    if (this.isStaticResource(url)) return false;

    // Solo transformar HTML
    return contentType.includes('text/html');
  }
}