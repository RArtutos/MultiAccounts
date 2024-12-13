import { chromium } from 'playwright';
import { browserConfig } from '../../config/browser.js';
import { proxyManager } from '../proxy/proxyManager.js';

export class BrowserManager {
  constructor() {
    this.browsers = new Map();
  }

  async createBrowser(accountId) {
    try {
      const browser = await chromium.launch({
        ...browserConfig,
        proxy: proxyManager.getProxyConfig()
      });
      this.browsers.set(accountId, browser);
      return browser;
    } catch (error) {
      if (error.message.includes('proxy')) {
        proxyManager.switchToHttps();
        const browser = await chromium.launch({
          ...browserConfig,
          proxy: proxyManager.getProxyConfig()
        });
        this.browsers.set(accountId, browser);
        return browser;
      }
      throw error;
    }
  }

  async getBrowser(accountId) {
    if (!this.browsers.has(accountId)) {
      return this.createBrowser(accountId);
    }
    return this.browsers.get(accountId);
  }

  async closeBrowser(accountId) {
    const browser = this.browsers.get(accountId);
    if (browser) {
      await browser.close();
      this.browsers.delete(accountId);
    }
  }

  async closeAll() {
    for (const accountId of this.browsers.keys()) {
      await this.closeBrowser(accountId);
    }
  }
}