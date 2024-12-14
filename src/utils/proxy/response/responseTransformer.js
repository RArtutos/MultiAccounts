import { Transform } from 'stream';
import { rewriteUrls } from '../../urlRewriter.js';

export class ResponseTransformer extends Transform {
  constructor(account, targetDomain, req) {
    super();
    this.account = account;
    this.targetDomain = targetDomain;
    this.req = req;
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    try {
      const content = chunk.toString();
      
      // No transformar contenido JSON o XML
      if (this.req.headers['x-requested-with'] === 'XMLHttpRequest' ||
          content.trim().startsWith('{') || 
          content.trim().startsWith('[') ||
          content.trim().startsWith('<?xml')) {
        this.push(chunk);
        return callback();
      }

      const transformed = rewriteUrls(content, this.account, this.targetDomain, this.req);
      this.push(transformed);
      callback();
    } catch (error) {
      console.error('Error transforming content:', error);
      this.push(chunk);
      callback();
    }
  }
}