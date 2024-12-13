import { chromium } from 'playwright';

class BrowserPool {
  constructor() {
    this.browsers = new Map();
    this.pages = new Map();
    this.proxyConfig = {
      server: 'socks5://45.166.110.64:50101',
      username: 'arturojkl',
      password: 'HQKxDbtCiC'
    };
  }

  async getBrowser(accountId) {
    if (!this.browsers.has(accountId)) {
      const browser = await chromium.launch({
        headless: true,
        args: [
          '--disable-dev-shm-usage',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-gpu',
          '--no-zygote',
          '--disable-accelerated-2d-canvas',
          '--disable-accelerated-jpeg-decoding',
          '--disable-accelerated-mjpeg-decode',
          '--disable-accelerated-video-decode',
          '--disable-gpu-compositing',
          '--ignore-certificate-errors',
          '--enable-features=NetworkService',
          '--use-gl=swiftshader'
        ]
      });
      this.browsers.set(accountId, browser);
    }
    return this.browsers.get(accountId);
  }

  async getPage(accountId, cookies = []) {
    if (!this.pages.has(accountId)) {
      const browser = await this.getBrowser(accountId);
      const context = await browser.newContext({
        viewport: { width: 1920, height: 1080 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        proxy: this.proxyConfig
      });

      if (cookies.length > 0) {
        await context.addCookies(cookies);
      }

      const page = await context.newPage();
      
      // Configurar interceptores de red
      await page.route('**/*', async route => {
        const request = route.request();
        const resourceType = request.resourceType();
        
        // Permitir todos los recursos
        await route.continue();
        
        // Capturar cookies de respuesta
        if (resourceType === 'document') {
          const response = await route.fetch();
          const cookies = await context.cookies();
          // Actualizar cookies en la cuenta
          this.emit('cookiesUpdated', accountId, cookies);
        }
      });

      this.pages.set(accountId, page);
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