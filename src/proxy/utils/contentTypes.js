export const ContentTypes = {
  HTML: 'text/html',
  JAVASCRIPT: ['application/javascript', 'text/javascript'],
  JSON: 'application/json',
  CSS: 'text/css',
  
  shouldTransform(contentType) {
    if (!contentType) return false;
    
    const type = contentType.toLowerCase();
    return type.includes(this.HTML) || 
           this.JAVASCRIPT.some(jsType => type.includes(jsType)) ||
           type.includes(this.JSON);
  },
  
  isStaticResource(url) {
    return /\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot)(\?.*)?$/i.test(url);
  }
};