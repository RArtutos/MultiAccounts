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
      page = await sessionManager.createSession(account.name, account.cookies);
    }

    // Interceptar y reescribir respuestas
    await page.route('**/*', async route => {
      const response = await route.fetch();
      const headers = {
        ...response.headers(),
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': ''
      };
      await route.fulfill({ response, headers });
    });

    // Navegar a la URL solicitada
    const url = req.url.startsWith('/') ? 
      `${account.url}${req.url}` : 
      req.url;

    const response = await page.goto(url, {
      waitUntil: 'networkidle'
    });

    // Obtener y modificar el contenido
    const content = await page.content();
    const modifiedContent = content
      .replace(new RegExp(targetDomain, 'g'), req.get('host'))
      .replace(/<head>/, '<head><base href="/">')
      .replace(/integrity="[^"]*"/g, '');

    // Enviar respuesta
    res.send(modifiedContent);

  } catch (error) {
    console.error('Remote browser error:', error);
    next(error);
  }
}