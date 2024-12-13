import { chromium } from 'playwright';
import { browserConfig } from '../config/browser.js';
import { proxyManager } from './proxy/proxyManager.js';
import { createBrowserContext } from './browser/browserContext.js';
import { formatCookies } from '../utils/cookies/cookieFormatter.js';
import { validateCookie } from '../utils/cookies/cookieValidator.js';
import { CookieManager } from '../utils/cookies/cookieManager.js';

class BrowserPool {
  constructor() {
    this.browsers = new Map();
    this.pages = new Map();
    this.cookieManagers = new Map();
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

  async getPage(accountId, cookies = {}, domain) {
    if (!this.pages.has(accountId)) {
      const browser = await this.getBrowser(accountId);
      try {
        const context = await createBrowserContext(browser);
        
        // Crear o recuperar el gestor de cookies para esta cuenta
        if (!this.cookieManagers.has(accountId)) {
          this.cookieManagers.set(accountId, new CookieManager());
        }
        const cookieManager = this.cookieManagers.get(accountId);

        // Formatear y validar cookies
        const formattedCookies = cookieManager.formatCookies(cookies, domain);
        if (formattedCookies.length > 0) {
          console.log('Applying cookies:', formattedCookies);
          await context.addCookies(formattedCookies);
        }

        const page = await context.newPage();
        
        // Configurar interceptor de cookies
        await page.route('**/*', async route => {
          const request = route.request();
          const headers = request.headers();
          
          // Agregar cookies al header de la petición
          const cookieString = cookieManager.getCookieString(cookies, domain);
          if (cookieString) {
            headers['cookie'] = cookieString;
          }
          
          await route.continue({ headers });
        });

        this.pages.set(accountId, page);
      } catch (error) {
        console.error('Error al crear página:', error);
        throw error;
      }
    }
    return this.pages.get(accountId);
  }

  async updatePageCookies(accountId, cookies, domain) {
    try {
      const page = await this.getPage(accountId);
      if (page) {
        const context = page.context();
        const cookieManager = this.cookieManagers.get(accountId);
        
        await context.clearCookies();
        
        if (cookies && Object.keys(cookies).length > 0) {
          const formattedCookies = cookieManager.formatCookies(cookies, domain);
          console.log('Updating cookies:', formattedCookies);
          await context.addCookies(formattedCookies);
          
          // Verificar que las cookies se establecieron correctamente
          const currentCookies = await context.cookies();
          console.log('Current cookies after update:', currentCookies);
        }
      }
    } catch (error) {
      console.error('Error updating cookies:', error);
      throw error;
    }
  }

  async closeBrowser(accountId) {
    const browser = this.browsers.get(accountId);
    if (browser) {
      await browser.close();
      this.browsers.delete(accountId);
      this.pages.delete(accountId);
      this.cookieManagers.delete(accountId);
    }
  }

  async closeAll() {
    for (const accountId of this.browsers.keys()) {
      await this.closeBrowser(accountId);
    }
  }
}