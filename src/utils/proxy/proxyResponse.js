import { StaticHandler } from './static/staticHandler.js';
import { ResponseTransformer } from './response/responseTransformer.js';

const staticHandler = new StaticHandler();
const EXCLUDED_HEADERS = ['content-length', 'transfer-encoding', 'connection'];

export function handleProxyResponse(proxyRes, req, res, account, targetDomain) {
  if (res.headersSent) {
    return proxyRes.pipe(res);
  }

  try {
    // Copiar headers seguros
    Object.entries(proxyRes.headers)
      .filter(([key]) => !EXCLUDED_HEADERS.includes(key.toLowerCase()))
      .forEach(([key, value]) => res.setHeader(key, value));

    const contentType = proxyRes.headers['content-type'];
    const url = req.url;

    // Para recursos estáticos, hacer pipe directo
    if (staticHandler.isStaticResource(url)) {
      return proxyRes.pipe(res);
    }

    // Para HTML y JS, transformar contenido
    if (staticHandler.shouldTransform(contentType, url)) {
      const transformer = new ResponseTransformer(account, targetDomain, req);
      return proxyRes
        .pipe(transformer)
        .pipe(res);
    }

    // Para todo lo demás, pipe directo
    return proxyRes.pipe(res);
  } catch (error) {
    console.error('Error handling response:', error);
    if (!res.headersSent) {
      res.status(500).send('Internal server error');
    }
  }
}