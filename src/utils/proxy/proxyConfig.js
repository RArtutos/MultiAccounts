import { createProxyOptions } from './config/proxyOptions.js';
import { createCookieConfig } from './config/cookieConfig.js';
import { RequestHandler } from './handlers/requestHandler.js';
import { ResponseHandler } from './handlers/responseHandler.js';
import { ErrorHandler } from './handlers/errorHandler.js';

export function createProxyConfig(account, req, targetDomain) {
  const requestHandler = new RequestHandler(account, req);
  const responseHandler = new ResponseHandler();
  const errorHandler = new ErrorHandler();

  return {
    target: account.url,
    ...createProxyOptions(req),
    ...createCookieConfig(req),
    pathRewrite: requestHandler.createPathRewrite(),
    onProxyReq: (proxyReq, req, res) => {
      if (!res.headersSent) {
        requestHandler.handleRequest(proxyReq);
      }
    },
    onProxyRes: responseHandler.handle.bind(responseHandler),
    onError: errorHandler.handle.bind(errorHandler)
  };
}