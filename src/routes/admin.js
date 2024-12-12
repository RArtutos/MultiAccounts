import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import * as accountService from '../services/accountService.js';
import { renderAdminDashboard } from '../views/templates.js';

const router = express.Router();

// Dashboard de administración
router.get('/', adminAuth, async (req, res) => {
  const { accounts } = await accountService.getAccounts();
  res.send(renderAdminDashboard(accounts));
});

// Crear nueva cuenta
router.post('/accounts', adminAuth, async (req, res) => {
  try {
    const { name, url, maxUsers } = req.body;
    await accountService.addAccount(name, url, maxUsers);
    res.redirect('/admin');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Actualizar máximo de usuarios
router.post('/accounts/:name/max-users', adminAuth, async (req, res) => {
  try {
    const { maxUsers } = req.body;
    await accountService.updateAccountMaxUsers(decodeURIComponent(req.params.name), maxUsers);
    res.redirect('/admin');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Actualizar URL
router.post('/accounts/:name/url', adminAuth, async (req, res) => {
  try {
    const { url } = req.body;
    await accountService.updateAccountUrl(decodeURIComponent(req.params.name), url);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Gestionar cookies
router.post('/accounts/:name/cookies', adminAuth, async (req, res) => {
  try {
    const { cookieName, cookieValue } = req.body;
    await accountService.updateAccountCookies(
      decodeURIComponent(req.params.name),
      { name: cookieName, value: cookieValue }
    );
    res.redirect('/admin');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Eliminar cookie
router.post('/accounts/:name/cookies/:cookieName', adminAuth, async (req, res) => {
  try {
    if (req.body._method === 'DELETE') {
      await accountService.deleteAccountCookie(
        decodeURIComponent(req.params.name),
        decodeURIComponent(req.params.cookieName)
      );
    }
    res.redirect('/admin');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Eliminar cuenta
router.post('/accounts/:name', adminAuth, async (req, res) => {
  try {
    if (req.body._method === 'DELETE') {
      await accountService.deleteAccount(decodeURIComponent(req.params.name));
    }
    res.redirect('/admin');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Cambiar estado de la cuenta
router.post('/accounts/:name/toggle', adminAuth, async (req, res) => {
  try {
    await accountService.toggleAccountStatus(decodeURIComponent(req.params.name));
    res.redirect('/admin');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Expulsar usuario
router.delete('/accounts/:name/users/:userId', adminAuth, async (req, res) => {
  try {
    await accountService.kickUser(
      decodeURIComponent(req.params.name),
      decodeURIComponent(req.params.userId)
    );
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { router as adminRouter };