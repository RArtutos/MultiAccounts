import { createProxyMiddleware } from 'http-proxy-middleware';
import { handleProxyResponse } from '../utils/proxy/proxyResponse.js';
import { getServiceDomain } from '../utils/urlUtils.js';

export async function createStreamingProxy(req, res, next) {
  const account = req.streamingAccount;
  const targetDomain = getServiceDomain(account.url);
  
  if (!targetDomain) {
    return res.status(400).send('URL inválida');
  }

  try {
    const proxy = createProxyMiddleware({
      target: account.url,
      changeOrigin: true,
      secure: true,
      followRedirects: true,
      ws: true,
      xfwd: true,
      onProxyRes: (proxyRes, req, res) => handleProxyResponse(proxyRes, req, res, account, targetDomain)
    });

    return proxy(req, res, next);
  } catch (error) {
    console.error('Error creando proxy:', error);
    if (!res.headersSent) {
      res.status(500).send('Error en el proxy');
    }
  }
}