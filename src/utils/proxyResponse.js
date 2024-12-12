import { CompressionTransform } from './compression.js';
import { rewriteUrls } from './urlRewriter.js';
import { Transform } from 'stream';

class HtmlTransform extends Transform {
  constructor(account, targetDomain) {
    super();
    this.account = account;
    this.targetDomain = targetDomain;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    callback();
  }

  _flush(callback) {
    try {
      const transformed = rewriteUrls(this.buffer, this.account, this.targetDomain);
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
    if (location.includes(targetDomain) || location.startsWith('/')) {
      const newLocation = location.replace(/^https?:\/\/[^\/]+/, '');
      proxyRes.headers.location = `/stream/${encodeURIComponent(account.name)}${newLocation}`;
    }
  }

  // Copiar headers relevantes
  Object.keys(proxyRes.headers).forEach(key => {
    // Excluir headers de compresión ya que manejaremos esto nosotros
    if (!['content-encoding', 'content-length'].includes(key.toLowerCase())) {
      res.setHeader(key, proxyRes.headers[key]);
    }
  });

  const contentType = proxyRes.headers['content-type'];
  const isHtml = contentType?.includes('text/html');

  // Configurar la cadena de transformación
  let pipeline = proxyRes;

  // Agregar descompresión/recompresión si es necesario
  if (proxyRes.headers['content-encoding'] === 'gzip') {
    pipeline = pipeline.pipe(new CompressionTransform());
    res.setHeader('content-encoding', 'gzip');
  }

  // Agregar transformación HTML si es necesario
  if (isHtml) {
    pipeline = pipeline.pipe(new HtmlTransform(account, targetDomain));
  }

  // Manejar errores en la pipeline
  pipeline.on('error', (error) => {
    console.error('Error en la pipeline de proxy:', error);
    if (!res.headersSent) {
      res.status(500).send('Error procesando la respuesta');
    }
  });

  // Enviar al cliente
  pipeline.pipe(res);
}