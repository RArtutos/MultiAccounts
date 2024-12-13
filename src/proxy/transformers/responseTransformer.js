import { Transform } from 'stream';
import { UrlRewriter } from '../url/urlRewriter.js';

export class ResponseTransformer extends Transform {
  constructor(account, targetDomain, req) {
    super();
    this.account = account;
    this.targetDomain = targetDomain;
    this.req = req;
    this.urlRewriter = new UrlRewriter();
    this.buffer = '';
  }

  _transform(chunk, encoding, callback) {
    this.buffer += chunk.toString();
    callback();
  }

  _flush(callback) {
    try {
      const transformed = this.transformContent(this.buffer);
      this.push(transformed);
      callback();
    } catch (error) {
      console.error('Error transformando contenido:', error);
      this.push(this.buffer);
      callback();
    }
  }

  transformContent(content) {
    try {
      // Transformar atributos HTML
      content = this.transformHtmlAttributes(content);
      
      // Transformar JavaScript
      content = this.transformJavaScript(content);
      
      // Transformar meta refresh
      content = this.transformMetaRefresh(content);
      
      // Transformar URLs en texto
      content = this.transformTextUrls(content);
      
      return content;
    } catch (error) {
      console.error('Error en transformación de contenido:', error);
      return content;
    }
  }

  transformHtmlAttributes(content) {
    const urlAttributes = [
      'href',
      'src',
      'action',
      'data-src',
      'poster',
      'formaction',
      'data-url',
      'data-href'
    ];

    const attributePattern = new RegExp(
      `(${urlAttributes.join('|')})\\s*=\\s*["']([^"']+)["']`,
      'gi'
    );

    return content.replace(attributePattern, (match, attr, url) => {
      const rewrittenUrl = this.urlRewriter.rewriteUrl(url, this.account, this.targetDomain);
      return `${attr}="${rewrittenUrl}"`;
    });
  }

  transformJavaScript(content) {
    const patterns = [
      // Redirecciones directas
      {
        regex: /(window\.location|location|window\.location\.href|location\.href)\s*=\s*["']([^"']+)["']/gi,
        urlGroup: 2
      },
      // Funciones de navegación
      {
        regex: /(window\.open|location\.replace|location\.assign|navigate|history\.pushState.*?|history\.replaceState.*?)\(["']([^"']+)["']/gi,
        urlGroup: 2
      },
      // AJAX y Fetch
      {
        regex: /(fetch|axios\.get|axios\.post|\.ajax)\(["']([^"']+)["']/gi,
        urlGroup: 2
      },
      // URLs en strings
      {
        regex: /(['"])(\/[^'"]+)(['"])/g,
        urlGroup: 2
      }
    ];

    return patterns.reduce((content, pattern) => {
      return content.replace(pattern.regex, (match, ...args) => {
        const url = args[pattern.urlGroup - 1];
        const rewrittenUrl = this.urlRewriter.rewriteUrl(url, this.account, this.targetDomain);
        return match.replace(url, rewrittenUrl);
      });
    }, content);
  }

  transformMetaRefresh(content) {
    return content.replace(
      /content=["'](\d*;\s*URL=)([^"']+)["']/gi,
      (match, prefix, url) => {
        const rewrittenUrl = this.urlRewriter.rewriteUrl(url, this.account, this.targetDomain);
        return `content="${prefix}${rewrittenUrl}"`;
      }
    );
  }

  transformTextUrls(content) {
    // Buscar URLs absolutas que empiecen con /
    return content.replace(
      /(['"\s])(\/[a-zA-Z0-9\-._~!$&'()*+,;=:@%/]*)/g,
      (match, prefix, url) => {
        if (this.shouldSkipUrl(url)) return match;
        const rewrittenUrl = this.urlRewriter.rewriteUrl(url, this.account, this.targetDomain);
        return `${prefix}${rewrittenUrl}`;
      }
    );
  }

  shouldSkipUrl(url) {
    // Ignorar URLs de recursos estáticos
    if (url.match(/\.(jpg|jpeg|png|gif|svg|webp|css|js|woff2?|ttf|eot)(\?.*)?$/i)) {
      return true;
    }
    
    // Ignorar URLs que ya tienen nuestro prefijo
    const accountPrefix = `/stream/${encodeURIComponent(this.account.name)}`;
    if (url.startsWith(accountPrefix)) {
      return true;
    }

    return false;
  }
}