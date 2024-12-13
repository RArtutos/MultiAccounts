import { BrowserManager } from './browser/browserManager.js';
import { PageManager } from './browser/pageManager.js';

class BrowserPool {
  constructor() {
    this.browserManager = new BrowserManager();
    this.pageManager = new PageManager();
  }

  async getBrowser(accountId) {
    return this.browserManager.getBrowser(accountId);
  }

  async getPage(accountId, cookies = {}, domain) {
    let page = this.pageManager.getPage(accountId);
    
    if (!page) {
      const browser = await this.getBrowser(accountId);
      page = await this.pageManager.createPage(browser, accountId, cookies, domain);
    }
    
    return page;
  }

  async updatePageCookies(accountId, cookies, domain) {
    const page = await this.getPage(accountId);
    if (page) {
      await this.pageManager.updatePageCookies(accountId, page, cookies, domain);
    }
  }

  async closeBrowser(accountId) {
    await this.browserManager.closeBrowser(accountId);
    this.pageManager.deletePage(accountId);
  }

  async closeAll() {
    await this.browserManager.closeAll();
  }
}

// Create and export a singleton instance
export const browserPool = new BrowserPool();