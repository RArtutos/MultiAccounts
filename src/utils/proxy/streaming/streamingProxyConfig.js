import { HttpsProxyAgent } from 'https-proxy-agent';
import { CookieManager } from '../cookies/cookieManager.js';

export class StreamingProxyConfig {
  constructor(account, req, targetDomain) {
    this.account = account;
    this.req = req;
    this.targetDomain = targetDomain;
    this.cookieManager = new CookieManager(account);
  }

  isStreamingService() {
    return this.targetDomain.includes('netflix.com') || 
           this.targetDomain.includes('hbomax.com') || 
           this.targetDomain.includes('disneyplus.com');
  }

  createConfig() {
    const baseConfig = {
      target: this.account.url,
      changeOrigin: true,
      secure: true,
      followRedirects: true,
      autoRewrite: true,
      ws: true,
      xfwd: true,
      cookieDomainRewrite: {
        '*': this.req.get('host')
      },
      wsOptions: {
        maxPayload: 64 * 1024 * 1024,
        pingTimeout: 60000,
        pingInterval: 25000
      },
      headers: this.cookieManager.getHeaders(this.req)
    };

    if (this.isStreamingService()) {
      baseConfig.agent = new HttpsProxyAgent({
        host: 'squid',
        port: 3128,
        auth: 'arturojkl:HQKxDbtCiC'
      });
    }

    return baseConfig;
  }
}