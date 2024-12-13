import { Transform } from 'stream';
import { ContentRewriter } from '../../utils/url/contentRewriter.js';

export class ContentTransformer extends Transform {
  constructor(account, req) {
    super();
    this.contentRewriter = new ContentRewriter(account, req);
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    callback();
  }

  _flush(callback) {
    try {
      const transformed = this.contentRewriter.rewrite(this.buffer);
      this.push(transformed);
      callback();
    } catch (error) {
      console.error('Error transforming content:', error);
      this.push(this.buffer);
      callback();
    }
  }
}