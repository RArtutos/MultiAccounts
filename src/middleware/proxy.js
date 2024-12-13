import { createProxyMiddleware } from 'http-proxy-middleware';
import { handleProxyResponse } from '../utils/proxy/proxyResponse.js';
import { getServiceDomain } from '../utils/urlUtils.js';
import { createProxyConfig } from '../utils/proxy/proxyConfig.js';
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
    
    const proxyConfig = createProxyConfig(account, req, targetDomain);
    const proxy = createProxyMiddleware({
      ...proxyConfig,
      selfHandleResponse: true,
      onProxyRes: (proxyRes, req, res) => handleProxyResponse(proxyRes, req, res, account, targetDomain)
    });

    return proxy(req, res, next);
  } catch (error) {
    console.error('Error creando proxy:', error);
    if (!res.headersSent) {
      if (error.code === 'EAI_AGAIN') {
        res.status(503).send('El servicio no está disponible en este momento. Por favor, inténtelo más tarde.');
      } else {
        res.status(500).send('Error en el proxy');
      }
    }
  }
}