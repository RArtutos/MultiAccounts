import express from 'express';
import { adminRouter } from './admin.js';
import { proxyRouter } from './proxy.js';
import * as accountService from '../services/accountService.js';
import { renderUserDashboard } from '../views/templates/userDashboard.js';
import { config } from '../config/index.js';
import { getServiceDomain } from '../utils/urlUtils.js';

const router = express.Router();

// Middleware para determinar si la petición es para el proxy o el dashboard
router.use(async (req, res, next) => {
  const host = req.get('host');
  
  // Si estamos en el dominio principal, manejamos rutas normales
  if (host === config.domain.base) {
    return next();
  }

  // Extraer el subdominio (nombre de la cuenta)
  const accountName = host.split('.')[0];
  if (!accountName) {
    return res.status(400).send('Invalid subdomain');
  }

  // Obtener la cuenta
  const { accounts } = await accountService.getAccounts();
  const account = accounts.find(acc => acc.name === accountName);
  
  if (!account) {
    return res.status(404).send('Account not found');
  }

  // Verificar si la cuenta está disponible
  if (account.status !== 'Available') {
    return res.status(403).send('Account is not available');
  }

  // Adjuntar la cuenta y el dominio objetivo al request
  req.streamingAccount = account;
  req.targetDomain = getServiceDomain(account.url);

  // Pasar al router del proxy
  return proxyRouter(req, res, next);
});

// Rutas del panel de administración
router.use('/admin', adminRouter);

// Dashboard público
router.get('/dashboard', async (req, res) => {
  const { accounts } = await accountService.getAccounts();
  const accountsWithUrls = accounts.map(account => ({
    ...account,
    proxyUrl: `${config.domain.protocol}://${account.name}.${config.domain.base}`
  }));
  res.send(renderUserDashboard(accountsWithUrls));
});

// Redirección raíz al dashboard
router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

export { router };