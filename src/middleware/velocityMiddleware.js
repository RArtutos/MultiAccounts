import { VelocityService } from '../services/velocityService.js';

export async function setupVelocityMiddleware(req, res, next) {
  try {
    // Obtener el nombre de la cuenta del subdominio
    const host = req.get('host');
    const accountName = host.split('.')[0];

    if (!accountName) {
      return res.status(400).send('Invalid subdomain');
    }

    // Configurar Velocity para la cuenta
    const velocityService = new VelocityService({
      name: accountName,
      // Otras propiedades necesarias
    });

    req.velocityProxy = await velocityService.createProxyInstance();
    next();
  } catch (error) {
    next(error);
  }
}