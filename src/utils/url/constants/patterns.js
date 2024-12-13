export const patterns = {
  // HTML attribute patterns
  HTML_ATTRIBUTES: /(href|src|action|data-src|poster|formaction)=["']([^"']+)["']/gi,
  
  // Meta refresh pattern
  META_REFRESH: /content=["'](\d*;\s*URL=)([^"']+)["']/gi,
  
  // Meta tags pattern
  META_TAGS: /(content=["'][^"']*?url\()([^)]+)(\))/gi,
  
  // JavaScript patterns
  JS_PATTERNS: [
    // Direct redirects
    /(window\.location|location|window\.location\.href|location\.href)\s*=\s*["']([^"']+)["']/gi,
    // Navigation functions
    /(window\.open|location\.replace|location\.assign)\(["']([^"']+)["']/gi,
    // AJAX requests
    /(fetch|axios\.get|axios\.post|\.ajax)\(["']([^"']+)["']/gi,
    // URLs in strings
    /(['"])(\/[^'"]+)(['"])/g
  ],
  
  // Static resource pattern
  STATIC_RESOURCE: /\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot|ico|mp4|webm|mp3|wav)(\?.*)?$/i
};