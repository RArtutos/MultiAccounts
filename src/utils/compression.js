import zlib from 'zlib';
import { promisify } from 'util';
import { Transform } from 'stream';

const gunzip = promisify(zlib.gunzip);
const gzip = promisify(zlib.gzip);

export class CompressionTransform extends Transform {
  constructor(options = {}) {
    super(options);
    this.chunks = [];
  }

  _transform(chunk, encoding, callback) {
    this.chunks.push(chunk);
    callback();
  }

  async _flush(callback) {
    try {
      const buffer = Buffer.concat(this.chunks);
      const decompressed = await gunzip(buffer);
      const recompressed = await gzip(decompressed);
      this.push(recompressed);
      callback();
    } catch (error) {
      // Si falla la descompresión/recompresión, enviar el contenido original
      const original = Buffer.concat(this.chunks);
      this.push(original);
      callback();
    }
  }
}