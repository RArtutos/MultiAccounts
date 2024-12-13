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