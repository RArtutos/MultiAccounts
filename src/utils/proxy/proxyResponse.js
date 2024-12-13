import { StaticHandler } from './static/staticHandler.js';
import { ResponseTransformer } from './response/responseTransformer.js';
import { CompressionHandler } from './compression/compressionHandler.js';

const staticHandler = new StaticHandler();
const EXCLUDED_HEADERS = [
  'content-encoding',
  'content-length',
  'content-security-policy',
  'transfer-encoding'
];

export function handleProxyResponse(proxyRes, req, res, account, targetDomain) {
  if (res.headersSent) {
    console.warn('Headers already sent');
    return proxyRes.pipe(res);
  }

  try {
    // Copiar headers seguros
    Object.entries(proxyRes.headers)
      .filter(([key]) => !EXCLUDED_HEADERS.includes(key.toLowerCase()))
      .forEach(([key, value]) => {
        try {
          res.setHeader(key, value);
        } catch (error) {
          console.warn(`Error setting header ${key}:`, error);
        }
      });

    const contentType = proxyRes.headers['content-type'];
    const url = req.url;

    // Para recursos estáticos, enviar directamente sin transformación
    if (staticHandler.isStaticResource(url)) {
      return proxyRes.pipe(res);
    }

    // Configurar pipeline
    let pipeline = proxyRes;

    // Descomprimir si es necesario
    const decompressor = CompressionHandler.createDecompressor(proxyRes.headers['content-encoding']);
    if (decompressor) {
      pipeline = pipeline.pipe(decompressor);
    }

    // Transformar contenido si es necesario (solo HTML)
    if (contentType && contentType.includes('text/html')) {
      pipeline = pipeline.pipe(new ResponseTransformer(account, targetDomain, req));
    }

    // Recomprimir basado en Accept-Encoding
    const compressor = CompressionHandler.createCompressor(req.headers['accept-encoding'] || '');
    if (compressor) {
      res.setHeader('Content-Encoding', compressor.encoding);
      pipeline = pipeline.pipe(compressor.stream);
    }

    // Manejar errores
    pipeline.on('error', (error) => {
      console.error('Pipeline error:', error);
      if (!res.headersSent) {
        res.status(500).send('Error procesando la respuesta');
      }
    });

    // Enviar respuesta
    pipeline.pipe(res);
  } catch (error) {
    console.error('Error handling response:', error);
    if (!res.headersSent) {
      res.status(500).send('Error interno del servidor');
    }
  }
}