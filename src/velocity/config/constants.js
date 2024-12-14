export const VELOCITY_PATHS = {
  STATIC: '/velocity',
  BARE: '/bare',
  SERVICE: '/service'
};

export const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br'
};

export const CLIENT_CONFIG = {
  title: 'Streaming Proxy',
  favicon: '/favicon.ico',
  scripts: [
    '/velocity/uv.bundle.js',
    '/velocity/uv.config.js'
  ]
};