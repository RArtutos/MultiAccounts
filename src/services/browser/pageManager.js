import { createBrowserContext } from './browserContext.js';
import { BrowserCookieHandler } from './cookieHandler.js';

export class PageManager {
  constructor() {
    this.pages = new Map();
    this.cookieHandler = new BrowserCookieHandler();
  }

  async createPage(browser, accountId, cookies = {}, domain) {
    try {
      const context = await createBrowserContext(browser);
      await this.cookieHandler.applyCookies(context, cookies, domain);

      const page = await context.newPage();
      
      // Configure request interception
      await page.route('**/*', async route => {
        const request = route.request();
        const headers = request.headers();
        
        const cookieString = this.cookieHandler.getCookieString(cookies, domain);
        if (cookieString) {
          headers['cookie'] = cookieString;
        }
        
        await route.continue({ headers });
      });

      this.pages.set(accountId, page);
      return page;
    } catch (error) {
      console.error('Error creating page:', error);
      throw error;
    }
  }

  async updatePageCookies(accountId, page, cookies, domain) {
    try {
      const context = page.context();
      await context.clearCookies();
      await this.cookieHandler.applyCookies(context, cookies, domain);
    } catch (error) {
      console.error('Error updating page cookies:', error);
      throw error;
    }
  }

  getPage(accountId) {
    return this.pages.get(accountId);
  }

  deletePage(accountId) {
    this.pages.delete(accountId);
  }
}