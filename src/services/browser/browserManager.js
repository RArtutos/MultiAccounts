import puppeteer from 'puppeteer';
import { proxyConfig } from '../../config/proxy.js';

export class BrowserManager {
  constructor() {
    this.browsers = new Map();
    this.displays = new Map();
  }

  async createBrowser(accountId) {
    try {
      const displayNum = 99 + parseInt(accountId);
      const display = `:${displayNum}`;
      
      // Configurar browser con Puppeteer
      const browser = await puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920,1080',
          `--proxy-server=${proxyConfig.server}`,
          '--enable-features=NetworkService',
          `--display=${display}`
        ],
        defaultViewport: {
          width: 1920,
          height: 1080
        }
      });

      // Configurar autenticación de proxy
      const page = await browser.newPage();
      await page.authenticate({
        username: proxyConfig.username,
        password: proxyConfig.password
      });

      this.browsers.set(accountId, browser);
      this.displays.set(accountId, display);

      return browser;
    } catch (error) {
      console.error('Error creating browser:', error);
      throw error;
    }
  }

  async getBrowser(accountId) {
    if (!this.browsers.has(accountId)) {
      return this.createBrowser(accountId);
    }
    return this.browsers.get(accountId);
  }

  getDisplay(accountId) {
    return this.displays.get(accountId);
  }

  async closeBrowser(accountId) {
    const browser = this.browsers.get(accountId);
    if (browser) {
      await browser.close();
      this.browsers.delete(accountId);
      this.displays.delete(accountId);
    }
  }

  async closeAll() {
    for (const accountId of this.browsers.keys()) {
      await this.closeBrowser(accountId);
    }
  }
}

export const browserManager = new BrowserManager();