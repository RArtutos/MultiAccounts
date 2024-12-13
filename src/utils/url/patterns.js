export const urlPatterns = {
  // Patrones HTML
  HTML_ATTRIBUTES: /(href|src|action|data-src|poster|formaction|data-url|data-href)=["']([^"']+)["']/gi,
  META_REFRESH: /content=["'](\d*;\s*URL=)([^"']+)["']/gi,
  INLINE_STYLES: /url\(['"]?([^'")]+)['"]?\)/gi,
  
  // Patrones JavaScript
  JS_REDIRECTS: /(window\.location|location|window\.location\.href|location\.href)\s*=\s*["']([^"']+)["']/gi,
  JS_NAVIGATION: /(window\.open|location\.replace|location\.assign|navigate|history\.pushState.*?|history\.replaceState.*?)\(["']([^"']+)["']/gi,
  JS_AJAX: /(fetch|axios\.get|axios\.post|\.ajax)\(["']([^"']+)["']/gi,
  JS_STRING_URLS: /(['"])(https?:\/\/[^'"]+|\/[^'"]+)(['"])/g,
  
  // Recursos estáticos
  STATIC_RESOURCES: /\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot|ico)(\?.*)?$/i
};