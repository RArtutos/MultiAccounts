// Patrones para recursos estáticos de frameworks comunes
export const STATIC_PATTERNS = [
  // Next.js
  /\/_next\/static\/.+/,
  /\/_next\/image\/.+/,
  /\/_next\/data\/.+/,
  
  // React
  /\/static\/.+/,
  
  // Vue
  /\/_nuxt\/static\/.+/,
  /\/_nuxt\/.+/,
  
  // Angular
  /\/assets\/.+/,
  
  // Webpack/general
  /\.hot-update\.json$/,
  /\.hot-update\.js$/,
  /\.chunk\.js$/,
  /\.bundle\.js$/,
  
  // Common static file extensions
  /\.(css|js|jpg|jpeg|png|gif|ico|svg|woff2?|ttf|eot|map)(\?.*)?$/
];