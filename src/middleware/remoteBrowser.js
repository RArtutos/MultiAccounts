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

    // Obtener o crear sesión de navegador
    let page = await sessionManager.getSession(account.name);
    if (!page) {
      page = await sessionManager.createSession(account.name, account.cookies || {}, targetDomain);
    } else {
      // Actualizar cookies si la sesión ya existe
      await sessionManager.updateSession(account.name, account.cookies || {}, targetDomain);
    }

    // Construir la URL completa
    const url = new URL(req.url.startsWith('/') ? req.url : `/${req.url}`, account.url).toString();

    console.log(`Navigating to: ${url}`);
    console.log('Current cookies:', account.cookies);

    // Navegar a la página
    await page.goto(url, {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Verificar cookies después de la navegación
    const context = page.context();
    const currentCookies = await context.cookies();
    console.log('Cookies after navigation:', currentCookies);

    // Obtener el contenido
    const content = await page.content();

    // Establecer headers de respuesta seguros
    res.set({
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store'
    });

    // Enviar respuesta
    res.send(content);

  } catch (error) {
    console.error('Remote browser error:', error);
    next(error);
  }
}