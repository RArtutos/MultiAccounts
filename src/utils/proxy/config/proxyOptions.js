export const createProxyOptions = (req) => ({
  timeout: 60000,
  proxyTimeout: 60000,
  changeOrigin: true,
  secure: true,
  followRedirects: true,
  autoRewrite: true,
  xfwd: true,
  ws: true
});