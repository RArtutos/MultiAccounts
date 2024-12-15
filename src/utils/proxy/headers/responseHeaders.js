export function setupResponseHeaders(proxyRes, req, res) {
  // Remove security headers
  const headersToRemove = [
    'content-security-policy',
    'x-frame-options',
    'x-content-type-options',
    'x-xss-protection',
    'strict-transport-security'
  ];

  headersToRemove.forEach(header => {
    delete proxyRes.headers[header.toLowerCase()];
  });

  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Credentials': 'true'
  };

  Object.entries(corsHeaders).forEach(([key, value]) => {
    if (!res.headersSent) {
      res.setHeader(key, value);
    }
  });
}