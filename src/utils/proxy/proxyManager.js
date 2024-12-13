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
    if (this.retryCount >= this.maxRetries) {
      return false;
    }

    this.currentAgent = this.currentAgent === this.httpAgent ? 
      this.socksAgent : this.httpAgent;
    this.retryCount++;
    
    console.log(`Switched to ${this.currentAgent === this.httpAgent ? 'HTTP' : 'SOCKS5'} proxy`);
    return true;
  }

  resetRetryCount() {
    this.retryCount = 0;
    this.currentAgent = this.httpAgent;
  }
}