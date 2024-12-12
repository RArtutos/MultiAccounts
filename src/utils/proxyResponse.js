import { Transform } from 'stream';
import { rewriteUrls } from './urlRewriter.js';

export function handleProxyResponse(proxyRes, req, res, account, targetDomain) {
  // Handle redirects
  if (proxyRes.headers.location) {
    const location = proxyRes.headers.location;
    if (location.includes(targetDomain) || location.startsWith('/')) {
      const newLocation = location.replace(/^https?:\/\/[^\/]+/, '');
      proxyRes.headers.location = `/stream/${encodeURIComponent(account.name)}${newLocation}`;
    }
  }

  const contentType = proxyRes.headers['content-type'];
  if (!contentType?.includes('text/html')) {
    // For non-HTML responses, pipe directly
    proxyRes.pipe(res);
    return;
  }

  // Create transform stream for HTML content
  const transformStream = new Transform({
    transform(chunk, encoding, callback) {
      let html = chunk.toString();
      html = rewriteUrls(html, account, targetDomain);
      callback(null, html);
    }
  });

  // Pipe through transform stream
  proxyRes.pipe(transformStream).pipe(res);
}