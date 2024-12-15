export class ErrorHandler {
  handle(err, req, res) {
    console.error('Proxy error:', err);
    
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy error');
    }
  }
}