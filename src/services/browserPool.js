import { chromium } from 'playwright';

class BrowserPool {
  constructor() {
    this.browsers = new Map();
    this.pages = new Map();
  }

  async getBrowser(accountId) {
    if (!this.browsers.has(accountId)) {
      const browser = await chromium.launch({
        headless: true
      });
      this.browsers.set(accountId, browser);
    }
    return this.browsers.get(accountId);
  }

  async getPage(accountId) {
    if (!this.pages.has(accountId)) {
      const browser = await this.getBrowser(accountId);
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
      const page = await context.newPage();
      this.pages.set(accountId, page);
    }
    return this.pages.get(accountId);
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