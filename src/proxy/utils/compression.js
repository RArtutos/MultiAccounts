import zlib from 'zlib';

export class CompressionUtils {
  static createDecompressor(contentEncoding) {
    if (!contentEncoding) return null;
    
    switch (contentEncoding.toLowerCase()) {
      case 'gzip':
        return zlib.createGunzip();
      case 'deflate':
        return zlib.createInflate();
      case 'br':
        return zlib.createBrotliDecompress();
      default:
        return null;
    }
  }

  static createCompressor(acceptEncoding) {
    if (!acceptEncoding) return null;

    if (acceptEncoding.includes('gzip')) {
      return { encoding: 'gzip', stream: zlib.createGzip() };
    }
    if (acceptEncoding.includes('deflate')) {
      return { encoding: 'deflate', stream: zlib.createDeflate() };
    }
    if (acceptEncoding.includes('br')) {
      return { encoding: 'br', stream: zlib.createBrotliCompress() };
    }
    return null;
  }
}