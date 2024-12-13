import { ContentTransformer } from '../transformers/contentTransformer.js';
import { ContentTypes } from '../utils/contentTypes.js';
import { CompressionUtils } from '../utils/compression.js';

export class ResponseHandler {
  constructor() {
    this.excludedHeaders = ['content-length', 'content-encoding', 'transfer-encoding'];
  }

  handle(proxyRes, req, res, account, targetDomain) {
    if (res.headersSent) {
      return proxyRes.pipe(res);
    }

    try {
      // Copy safe headers
      this.copyHeaders(proxyRes, res);

      // Handle content based on type
      const contentType = proxyRes.headers['content-type'];
      const contentEncoding = proxyRes.headers['content-encoding'];

      let pipeline = proxyRes;

      // Decompress if needed
      if (contentEncoding) {
        const decompressor = CompressionUtils.createDecompressor(contentEncoding);
        if (decompressor) {
          pipeline = pipeline.pipe(decompressor);
        }
      }

      // Transform content if needed
      if (ContentTypes.shouldTransform(contentType)) {
        pipeline = pipeline.pipe(new ContentTransformer(account, req, this.urlRewriter));
      }

      // Recompress if needed
      const acceptEncoding = req.headers['accept-encoding'] || '';
      const compressor = CompressionUtils.createCompressor(acceptEncoding);
      if (compressor) {
        res.setHeader('content-encoding', compressor.encoding);
        pipeline = pipeline.pipe(compressor.stream);
      }

      pipeline.pipe(res);
    } catch (error) {
      console.error('Error handling response:', error);
      if (!res.headersSent) {
        res.status(500).send('Error processing response');
      }
    }
  }

  copyHeaders(proxyRes, res) {
    Object.entries(proxyRes.headers)
      .filter(([key]) => !this.excludedHeaders.includes(key.toLowerCase()))
      .forEach(([key, value]) => {
        try {
          res.setHeader(key, value);
        } catch (error) {
          console.warn(`Could not set header ${key}:`, error.message);
        }
      });
  }
}