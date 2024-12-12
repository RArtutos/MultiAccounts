import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import * as accountService from '../services/accountService.js';
import { renderDashboard, renderAdminDashboard } from '../views/templates.js';
import { proxyRouter } from './proxy.js';

const router = express.Router();

// Montar rutas del proxy
router.use(proxyRouter);

// Rutas del dashboard
router.get('/dashboard', async (req, res) => {
  const { accounts } = await accountService.getAccounts();
  res.send(renderDashboard(accounts));
});

// Rutas de administración
router.get('/admin', adminAuth, async (req, res) => {
  const { accounts } = await accountService.getAccounts();
  res.send(renderAdminDashboard(accounts));
});

router.post('/admin/accounts', adminAuth, async (req, res) => {
  const { name, url, maxUsers } = req.body;
  await accountService.addAccount(name, url, maxUsers);
  res.redirect('/admin');
});

router.post('/admin/accounts/:name/max-users', adminAuth, async (req, res) => {
  const { maxUsers } = req.body;
  await accountService.updateAccountMaxUsers(decodeURIComponent(req.params.name), maxUsers);
  res.redirect('/admin');
});

router.post('/admin/accounts/:name/cookies', adminAuth, async (req, res) => {
  const { cookieName, cookieValue } = req.body;
  await accountService.updateAccountCookies(
    decodeURIComponent(req.params.name),
    { name: cookieName, value: cookieValue }
  );
  res.redirect('/admin');
});

router.post('/admin/accounts/:name/cookies/:cookieName', adminAuth, async (req, res) => {
  if (req.body._method === 'DELETE') {
    await accountService.deleteAccountCookie(
      decodeURIComponent(req.params.name),
      decodeURIComponent(req.params.cookieName)
    );
  }
  res.redirect('/admin');
});

router.post('/admin/accounts/:name', adminAuth, async (req, res) => {
  if (req.body._method === 'DELETE') {
    await accountService.deleteAccount(decodeURIComponent(req.params.name));
  }
  res.redirect('/admin');
});

router.post('/admin/accounts/:name/toggle', adminAuth, async (req, res) => {
  await accountService.toggleAccountStatus(decodeURIComponent(req.params.name));
  res.redirect('/admin');
});

export { router };