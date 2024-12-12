import { createProxyMiddleware } from 'http-proxy-middleware';
import { handleProxyResponse } from '../utils/proxyResponse.js';
import { getServiceDomain } from '../utils/urlUtils.js';
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

export async function createStreamingProxy(req, res, next) {
  const account = req.streamingAccount;
  const targetDomain = getServiceDomain(account.url);
  
  if (!targetDomain) {
    return res.status(400).send('URL inválida');
  }

  try {
    // Verificar que el dominio es alcanzable antes de crear el proxy
    await lookup(targetDomain);
    
    const proxy = createProxyMiddleware({
      target: account.url,
      changeOrigin: true,
      secure: true,
      followRedirects: true,
      ws: false,
      selfHandleResponse: true, // Importante: manejar la respuesta nosotros mismos
      pathRewrite: {
        [`^/stream/${encodeURIComponent(account.name)}`]: '',
      },
      onProxyRes: (proxyRes, req, res) => handleProxyResponse(proxyRes, req, res, account, targetDomain),
      onError: (err, req, res) => {
        console.error('Error de proxy:', err);
        if (!res.headersSent) {
          if (err.code === 'EAI_AGAIN') {
            res.status(503).send('El servicio no está disponible en este momento. Por favor, inténtelo más tarde.');
          } else {
            res.status(500).send('Error en el proxy');
          }
        }
      }
    });

    return proxy(req, res, next);
  } catch (error) {
    console.error('Error resolviendo dominio:', error);
    return res.status(503).send('El servicio no está disponible en este momento. Por favor, inténtelo más tarde.');
  }
}