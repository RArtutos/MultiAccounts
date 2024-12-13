import { StaticHandler } from './static/staticHandler.js';
import { ContentTransformer } from '../../proxy/transformers/contentTransformer.js';
import { CompressionHandler } from './compression/compressionHandler.js';

const staticHandler = new StaticHandler();
const EXCLUDED_HEADERS = ['content-encoding', 'content-length', 'content-security-policy', 'x-frame-options'];

export function handleProxyResponse(proxyRes, req, res, account, targetDomain) {
  if (res.headersSent) {
    console.warn('Headers already sent');
    return proxyRes.pipe(res);
  }

  try {
    // Copy safe headers
    Object.entries(proxyRes.headers)
      .filter(([key]) => !EXCLUDED_HEADERS.includes(key.toLowerCase()))
      .forEach(([key, value]) => {
        try {
          res.setHeader(key, value);
        } catch (error) {
          console.warn(`Could not set header ${key}:`, error.message);
        }
      });

    // Handle redirects
    if (proxyRes.headers.location) {
      const location = proxyRes.headers.location;
      const accountPrefix = `/stream/${encodeURIComponent(account.name)}`;
      
      try {
        const isAbsoluteUrl = location.startsWith('http') || location.startsWith('//');
        if (isAbsoluteUrl) {
          const locationUrl = new URL(location.startsWith('//') ? `https:${location}` : location);
          if (locationUrl.hostname === targetDomain || locationUrl.hostname.endsWith(`.${targetDomain}`)) {
            res.setHeader('location', `${accountPrefix}${locationUrl.pathname}${locationUrl.search}${locationUrl.hash}`);
          }
        } else {
          const cleanPath = location.startsWith('/') ? location : `/${location}`;
          if (!cleanPath.startsWith(accountPrefix)) {
            res.setHeader('location', `${accountPrefix}${cleanPath}`);
          }
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
    }

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
    if (!staticHandler.isStaticResource(url) && staticHandler.shouldTransform(contentType)) {
      pipeline = pipeline.pipe(new ContentTransformer(account, targetDomain, req));
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