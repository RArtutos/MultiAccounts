import { rewriteUrls } from '../urlRewriter.js';
import { RedirectHandler } from './redirectHandler.js';
import { Transform } from 'stream';
import zlib from 'zlib';

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
  // Si ya se enviaron los headers, no hacer nada
  if (res.headersSent) {
    console.warn('Headers already sent, skipping response handling');
    return proxyRes.pipe(res);
  }

  const redirectHandler = new RedirectHandler(account, targetDomain);

  try {
    // Manejar redirecciones
    if (proxyRes.headers.location) {
      proxyRes.headers.location = redirectHandler.handleRedirect(proxyRes.headers.location);
    }

    // Copiar headers relevantes
    Object.keys(proxyRes.headers).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (!['content-encoding', 'content-length', 'content-security-policy'].includes(lowerKey)) {
        res.setHeader(key, proxyRes.headers[key]);
      }
    });

    const contentType = proxyRes.headers['content-type'];
    const contentEncoding = proxyRes.headers['content-encoding']?.toLowerCase();
    const isHtml = contentType?.includes('text/html');
    const isJs = contentType?.includes('javascript');
    
    // No transformar recursos estáticos
    const isStatic = contentType?.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot)(\?.*)?$/i);
    const needsTransform = !isStatic && (isHtml || isJs);

    let pipeline = proxyRes;

    // Manejar descompresión
    if (contentEncoding === 'gzip') {
      pipeline = pipeline.pipe(zlib.createGunzip());
    } else if (contentEncoding === 'deflate') {
      pipeline = pipeline.pipe(zlib.createInflate());
    } else if (contentEncoding === 'br') {
      pipeline = pipeline.pipe(zlib.createBrotliDecompress());
    }

    // Aplicar transformaciones si es necesario
    if (needsTransform) {
      pipeline = pipeline.pipe(new HtmlTransform(account, targetDomain, req));
    }

    // Comprimir respuesta según acepte el cliente
    const acceptEncoding = req.headers['accept-encoding'] || '';
    if (acceptEncoding.includes('gzip')) {
      res.setHeader('Content-Encoding', 'gzip');
      pipeline = pipeline.pipe(zlib.createGzip());
    } else if (acceptEncoding.includes('deflate')) {
      res.setHeader('Content-Encoding', 'deflate');
      pipeline = pipeline.pipe(zlib.createDeflate());
    } else if (acceptEncoding.includes('br')) {
      res.setHeader('Content-Encoding', 'br');
      pipeline = pipeline.pipe(zlib.createBrotliCompress());
    }

    pipeline.on('error', (error) => {
      console.error('Error en la pipeline de proxy:', error);
      if (!res.headersSent) {
        res.status(500).send('Error procesando la respuesta');
      }
    });

    pipeline.pipe(res);
  } catch (error) {
    console.error('Error handling proxy response:', error);
    if (!res.headersSent) {
      res.status(500).send('Error interno del servidor');
    }
  }
}