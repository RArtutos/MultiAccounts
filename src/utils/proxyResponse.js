import { rewriteUrls } from './urlRewriter.js';
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
  // Manejar redirecciones
  if (proxyRes.headers.location) {
    const location = proxyRes.headers.location;
    const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
    
    try {
      // Verificar si es una URL absoluta
      const isAbsoluteUrl = location.startsWith('http') || location.startsWith('//');
      
      if (isAbsoluteUrl) {
        const locationUrl = new URL(location.startsWith('//') ? `https:${location}` : location);
        if (locationUrl.hostname === targetDomain || locationUrl.hostname.endsWith(`.${targetDomain}`)) {
          const path = locationUrl.pathname + locationUrl.search + locationUrl.hash;
          proxyRes.headers.location = `${accountPrefix}${path}`;
        }
      } else {
        // Para URLs relativas, asegurarnos de no duplicar el prefijo
        const cleanPath = location.startsWith('/') ? location : `/${location}`;
        if (!cleanPath.startsWith(accountPrefix)) {
          proxyRes.headers.location = `${accountPrefix}${cleanPath}`;
        }
      }
    } catch (error) {
      console.error('Error handling redirect:', error);
    }
  }

  // Copiar headers relevantes excepto los de compresión
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
  const isCss = contentType?.includes('text/css');
  
  // Solo transformar HTML y JavaScript, no CSS ni otros recursos
  const needsTransform = isHtml || isJs;

  let pipeline = proxyRes;

  // Manejar la descompresión si es necesario
  if (contentEncoding === 'gzip') {
    pipeline = pipeline.pipe(zlib.createGunzip());
  } else if (contentEncoding === 'deflate') {
    pipeline = pipeline.pipe(zlib.createInflate());
  } else if (contentEncoding === 'br') {
    pipeline = pipeline.pipe(zlib.createBrotliDecompress());
  }

  // Aplicar transformaciones solo si es necesario
  if (needsTransform) {
    pipeline = pipeline.pipe(new HtmlTransform(account, targetDomain, req));
  }

  // Comprimir la respuesta si el cliente lo acepta
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

  // Manejar errores en la pipeline
  pipeline.on('error', (error) => {
    console.error('Error en la pipeline de proxy:', error);
    if (!res.headersSent) {
      res.status(500).send('Error procesando la respuesta');
    }
  });

  // Enviar la respuesta
  pipeline.pipe(res);
}