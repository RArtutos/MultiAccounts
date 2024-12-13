import { chromium } from 'playwright';
import { browserConfig } from '../config/browser.js';
import { proxyManager } from './proxy/proxyManager.js';
import { createBrowserContext } from './browser/browserContext.js';

class BrowserPool {
  constructor() {
    this.browsers = new Map();
    this.pages = new Map();
  }

  async getBrowser(accountId) {
    if (!this.browsers.has(accountId)) {
      try {
        const browser = await chromium.launch({
          ...browserConfig,
          proxy: proxyManager.getProxyConfig()
        });
        this.browsers.set(accountId, browser);
      } catch (error) {
        console.error('Error al iniciar navegador:', error);
        // Intentar con proxy HTTPS si falla HTTP
        if (error.message.includes('proxy')) {
          proxyManager.switchToHttps();
          const browser = await chromium.launch({
            ...browserConfig,
            proxy: proxyManager.getProxyConfig()
          });
          this.browsers.set(accountId, browser);
        } else {
          throw error;
        }
      }
    }
    return this.browsers.get(accountId);
  }

  async getPage(accountId, cookies = []) {
    if (!this.pages.has(accountId)) {
      const browser = await this.getBrowser(accountId);
      try {
        const context = await createBrowserContext(browser);
        
        if (cookies.length > 0) {
          await context.addCookies(cookies);
        }

        const page = await context.newPage();
        this.pages.set(accountId, page);
      } catch (error) {
        console.error('Error al crear página:', error);
        throw error;
      }
    }
    return this.pages.get(accountId);
  }

  async updatePageCookies(accountId, cookies) {
    const page = await this.getPage(accountId);
    if (page) {
      const context = page.context();
      await context.clearCookies();
      if (cookies.length > 0) {
        await context.addCookies(cookies);
      }
    }
  }

  async closeBrowser(accountId) {
    const browser = this.browsers.get(accountId);
    if (browser) {
      await browser.close();
      this.browsers.delete(accountId);
      this.pages.delete(accountId);
    }
  }

  async closeAll() {
    for (const accountId of this.browsers.keys()) {
      await this.closeBrowser(accountId);
    }
  }
}

export const browserPool = new BrowserPool();