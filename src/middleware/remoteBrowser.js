import { sessionManager } from '../services/sessionManager.js';
import { getServiceDomain } from '../utils/urlUtils.js';

export async function remoteBrowserMiddleware(req, res, next) {
  try {
    const account = req.streamingAccount;
    if (!account) {
      return res.status(404).send('Account not found');
    }

    const targetDomain = getServiceDomain(account.url);
    if (!targetDomain) {
      return res.status(400).send('Invalid target URL');
    }

    // Convertir cookies del objeto a formato de Playwright
    const cookies = account.cookies ? Object.entries(account.cookies).map(([name, value]) => ({
      name,
      value,
      domain: targetDomain,
      path: '/'
    })) : [];

    // Obtener o crear sesión de navegador
    let page = await sessionManager.getSession(account.name);
    if (!page) {
      page = await sessionManager.createSession(account.name, cookies);
    }

    // Construir la URL completa
    const url = new URL(req.url.startsWith('/') ? req.url : `/${req.url}`, account.url).toString();

    // Navegar a la página
    await page.goto(url, {
      waitUntil: 'networkidle'
    });

    // Obtener el contenido
    const content = await page.content();
    const headers = await page.evaluate(() => {
      const headers = {};
      document.querySelectorAll('meta').forEach(meta => {
        const name = meta.getAttribute('name');
        const content = meta.getAttribute('content');
        if (name && content) {
          headers[name] = content;
        }
      });
      return headers;
    });

    // Establecer headers de respuesta
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers
    });

    // Enviar respuesta
    res.send(content);

  } catch (error) {
    console.error('Remote browser error:', error);
    next(error);
  }
}