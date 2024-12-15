export function setupRequestHeaders(proxyReq, req, targetDomain) {
  // Set basic headers first
  proxyReq.setHeader('Host', targetDomain);

  // Forward important headers
  const headersToForward = [
    'accept',
    'accept-encoding',
    'accept-language',
    'user-agent',
    'content-type',
    'authorization'
  ];

  headersToForward.forEach(header => {
    if (req.headers[header]) {
      proxyReq.setHeader(header, req.headers[header]);
    }
  });

  // Set Netflix specific headers
  const netflixHeaders = {
    'X-Netflix.client.request.name': 'ui/falcor',
    'X-Netflix.Request.Routing': 'ui',
    'X-Netflix.esn': 'NFCDCH-02-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    'X-Netflix.application.version': '2.0.0',
    'X-Netflix.application.name': 'web',
    'X-Netflix.device.type': 'web',
    'X-Netflix.certification.version': '1',
  };

  Object.entries(netflixHeaders).forEach(([key, value]) => {
    proxyReq.setHeader(key, value);
  });
}