export const velocityConfig = {
  prefix: '/service/',
  codec: 'plain',
  bare: {
    version: 2,
    path: '/bare/'
  },
  staticPath: '/velocity',
  client: {
    title: 'Streaming Proxy',
    favicon: '/favicon.ico'
  },
  netflix: {
    url: 'https://www.netflix.com',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br'
    }
  }
};