import express from 'express';
import { adminRouter } from './admin.js';
import { proxyRouter } from './proxy.js';
import * as accountService from '../services/accountService.js';
import { renderUserDashboard } from '../views/templates/userDashboard.js';
import { config } from '../config/index.js';

const router = express.Router();

// Montar rutas de administración en el dominio principal
router.use((req, res, next) => {
  const host = req.get('host');
  if (host === config.domain.base) {
    next();
  } else {
    proxyRouter(req, res, next);
  }
});

router.use('/admin', adminRouter);

// Dashboard público solo en el dominio principal
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