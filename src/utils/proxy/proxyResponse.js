import { StaticHandler } from './static/staticHandler.js';
import { ResponseTransformer } from './response/responseTransformer.js';
import { CompressionHandler } from './compression/compressionHandler.js';

const staticHandler = new StaticHandler();
const EXCLUDED_HEADERS = ['content-encoding', 'content-length', 'content-security-policy'];

export function handleProxyResponse(proxyRes, req, res, account, targetDomain) {
  if (res.headersSent) {
    console.warn('Headers already sent');
    return proxyRes.pipe(res);
  }

  try {
    // Copy safe headers
    Object.entries(proxyRes.headers)
      .filter(([key]) => !EXCLUDED_HEADERS.includes(key.toLowerCase()))
      .forEach(([key, value]) => res.setHeader(key, value));

    const contentType = proxyRes.headers['content-type'];
    const url = req.url;

    // Configure pipeline
    let pipeline = proxyRes;

    // Decompress if needed
    const decompressor = CompressionHandler.createDecompressor(proxyRes.headers['content-encoding']);
    if (decompressor) {
      pipeline = pipeline.pipe(decompressor);
    }

    // Transform content if needed
    if (!staticHandler.isStaticResource(url) && staticHandler.shouldTransform(contentType, url)) {
      pipeline = pipeline.pipe(new ResponseTransformer(account, targetDomain, req));
    }

    // Recompress based on Accept-Encoding
    const compressor = CompressionHandler.createCompressor(req.headers['accept-encoding'] || '');
    if (compressor) {
      res.setHeader('Content-Encoding', compressor.encoding);
      pipeline = pipeline.pipe(compressor.stream);
    }

    // Handle errors
    pipeline.on('error', (error) => {
      console.error('Pipeline error:', error);
      if (!res.headersSent) {
        res.status(500).send('Error processing response');
      }
    });

    pipeline.pipe(res);
  } catch (error) {
    console.error('Error handling response:', error);
    if (!res.headersSent) {
      res.status(500).send('Internal server error');
    }
  }
}