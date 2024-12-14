import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';

class BrowserService {
  constructor() {
    this.browsers = new Map();
    this.displays = new Map();
  }

  async createBrowserSession(accountId, url) {
    if (this.browsers.has(accountId)) {
      return this.browsers.get(accountId);
    }

    // Iniciar nueva sesión de navegador
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--start-maximized',
        '--disable-dev-shm-usage',
        `--display=:99`
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url);

    this.browsers.set(accountId, { browser, page });
    return { browser, page };
  }

  async closeBrowserSession(accountId) {
    const session = this.browsers.get(accountId);
    if (session) {
      await session.browser.close();
      this.browsers.delete(accountId);
    }
  }

  getVncUrl(accountId) {
    return `http://localhost:6080/vnc.html?autoconnect=true`;
  }
}

export const browserService = new BrowserService();