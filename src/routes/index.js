import express from 'express';
import { adminRouter } from './admin.js';
import { proxyRouter } from './proxy.js';
import * as accountService from '../services/accountService.js';
import { renderDashboard } from '../views/templates.js';

const router = express.Router();

// Montar rutas del proxy
router.use(proxyRouter);

// Montar rutas de administración
router.use('/admin', adminRouter);

// Dashboard público
router.get('/dashboard', async (req, res) => {
  const { accounts } = await accountService.getAccounts();
  res.send(renderDashboard(accounts));
});

// Redirección raíz al dashboard
router.get('/', (req, res) => {
  res.redirect('/dashboard');
});

export { router };