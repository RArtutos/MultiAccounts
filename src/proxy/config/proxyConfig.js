export const proxyConfig = {
  squid: {
    host: process.env.SQUID_HOST || 'squid',
    port: parseInt(process.env.SQUID_PORT, 10) || 3128,
  },
  timeouts: {
    connect: 5000,
    read: 30000,
  },
  retries: {
    max: 3,
    delay: 1000,
  }
};