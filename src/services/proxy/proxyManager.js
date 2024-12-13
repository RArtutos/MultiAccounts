import { proxyConfigs } from '../../config/proxy.js';

class ProxyManager {
  constructor() {
    this.currentConfig = proxyConfigs.http;
  }

  getProxyConfig() {
    return {
      server: this.currentConfig.server,
      username: this.currentConfig.username,
      password: this.currentConfig.password
    };
  }

  async testProxy() {
    try {
      const response = await fetch('https://api.ipify.org?format=json', {
        agent: this.getProxyAgent()
      });
      const data = await response.json();
      console.log('Proxy IP:', data.ip);
      return true;
    } catch (error) {
      console.error('Proxy test failed:', error);
      return false;
    }
  }

  switchToHttps() {
    this.currentConfig = proxyConfigs.https;
  }

  switchToHttp() {
    this.currentConfig = proxyConfigs.http;
  }
}

export const proxyManager = new ProxyManager();