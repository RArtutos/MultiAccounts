export const velocityConfig = {
  // Configuración base de Velocity
  prefix: '/service/',
  codec: 'plain', // o 'xor' para mayor seguridad
  bare: {
    version: 2,
    path: '/bare/'
  },
  // Configuración específica para Netflix
  netflix: {
    url: 'https://www.netflix.com',
    // Headers personalizados para evitar detección
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br'
    }
  }
};