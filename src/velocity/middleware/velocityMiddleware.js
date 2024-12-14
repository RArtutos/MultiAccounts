import { VelocityService } from '../services/velocityService.js';
import { isStaticPath } from '../utils/pathUtils.js';

export async function velocityMiddleware(req, res, next) {
  try {
    if (!req.streamingAccount) {
      return next();
    }

    const velocityService = new VelocityService(req.streamingAccount);
    const velocity = await velocityService.initialize();

    // Servir el cliente de Velocity en la ruta raíz
    if (req.path === '/') {
      return res.send(velocity.clientHtml);
    }

    // Servir archivos estáticos de Velocity
    if (isStaticPath(req.path)) {
      return next();
    }

    // Manejar solicitudes a través del proxy
    return velocity.proxy(req, res, next);
  } catch (error) {
    console.error('Velocity middleware error:', error);
    next(error);
  }
}