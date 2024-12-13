import { HttpsProxyAgent } from 'https-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { proxyConfig } from '../../config/proxy.js';

export class ProxyManager {
  constructor() {
    this.httpAgent = this.createHttpAgent();
    this.socksAgent = this.createSocksAgent();
    this.currentAgent = this.httpAgent;
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  createHttpAgent() {
    const { host, port, auth } = proxyConfig.mexico.http;
    const proxyUrl = `http://${auth.username}:${auth.password}@${host}:${port}`;
    return new HttpsProxyAgent(proxyUrl);
  }

  createSocksAgent() {
    const { host, port, auth } = proxyConfig.mexico.socks5;
    const proxyUrl = `socks5://${auth.username}:${auth.password}@${host}:${port}`;
    return new SocksProxyAgent(proxyUrl);
  }

  getAgent() {
    return this.currentAgent;
  }

  async switchToFallback() {
    if (this.currentAgent === this.httpAgent && this.retryCount < this.maxRetries) {
      console.log('Switching to SOCKS5 proxy...');
      this.currentAgent = this.socksAgent;
      this.retryCount++;
      return true;
    }
    if (this.currentAgent === this.socksAgent && this.retryCount < this.maxRetries) {
      console.log('Switching back to HTTP proxy...');
      this.currentAgent = this.httpAgent;
      this.retryCount++;
      return true;
    }
    return false;
  }

  resetRetryCount() {
    this.retryCount = 0;
    this.currentAgent = this.httpAgent;
  }
}