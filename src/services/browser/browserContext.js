import { browserConfig } from '../../config/browser.js';

export async function createBrowserContext(browser, options = {}) {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ...options
  });

  // Configurar interceptores de red
  await context.route('**/*', async route => {
    const request = route.request();
    try {
      await route.continue();
    } catch (error) {
      console.error('Error en interceptor de red:', error);
      await route.abort();
    }
  });

  return context;
}