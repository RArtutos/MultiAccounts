import { CompressionTransform } from './compression.js';
import { rewriteUrls } from './urlRewriter.js';
import { Transform } from 'stream';
import { isInternalUrl } from './urlUtils.js';

class HtmlTransform extends Transform {
  constructor(account, targetDomain, req) {
    super();
    this.account = account;
    this.targetDomain = targetDomain;
    this.req = req;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    callback();
  }

  _flush(callback) {
    try {
      const transformed = rewriteUrls(this.buffer, this.account, this.targetDomain, this.req);
      this.push(transformed);
      callback();
    } catch (error) {
      console.error('Error transforming HTML:', error);
      this.push(this.buffer);
      callback();
    }
  }
}

export function handleProxyResponse(proxyRes, req, res, account, targetDomain) {
  // Manejar redirecciones
  if (proxyRes.headers.location) {
    const location = proxyRes.headers.location;
    const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
    
    if (location.startsWith('http')) {
      try {
        const locationUrl = new URL(location);
        if (isInternalUrl(location, targetDomain)) {
          const path = locationUrl.pathname + locationUrl.search + locationUrl.hash;
          proxyRes.headers.location = `${accountPrefix}${path}`;
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
    } else {
      // Para URLs relativas o absolutas sin protocolo
      const cleanPath = location.replace(/^\/+/, '');
      proxyRes.headers.location = `${accountPrefix}/${cleanPath}`;
    }
  }

  // Copiar headers relevantes
  Object.keys(proxyRes.headers).forEach(key => {
    if (!['content-encoding', 'content-length'].includes(key.toLowerCase())) {
      res.setHeader(key, proxyRes.headers[key]);
    }
  });

  const contentType = proxyRes.headers['content-type'];
  const isHtml = contentType?.includes('text/html');

  let pipeline = proxyRes;

  if (proxyRes.headers['content-encoding'] === 'gzip') {
    pipeline = pipeline.pipe(new CompressionTransform());
    res.setHeader('content-encoding', 'gzip');
  }

  if (isHtml) {
    pipeline = pipeline.pipe(new HtmlTransform(account, targetDomain, req));
  }

  pipeline.on('error', (error) => {
    console.error('Error en la pipeline de proxy:', error);
    if (!res.headersSent) {
      res.status(500).send('Error procesando la respuesta');
    }
  });

  pipeline.pipe(res);
}
