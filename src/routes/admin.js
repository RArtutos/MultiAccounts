import express from 'express';
import { adminAuth } from '../middleware/auth.js';
import * as accountService from '../services/accountService.js';
import { renderAdminDashboard } from '../views/templates/adminDashboard.js';

const router = express.Router();

// Dashboard de administración
router.get('/', adminAuth, async (req, res) => {
  const { accounts } = await accountService.getAccounts();
  res.send(renderAdminDashboard(accounts));
});

// Crear nueva cuenta
router.post('/accounts', adminAuth, async (req, res) => {
  try {
    const { name, url, maxUsers, platform, icon, tags } = req.body;
    const tagsList = tags ? tags.split(',').map(tag => tag.trim()) : [];
    await accountService.addAccount(name, url, maxUsers, platform, icon, tagsList);
    res.redirect('/admin');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Eliminar cuenta
router.delete('/accounts/:name', adminAuth, async (req, res) => {
  try {
    const accountName = decodeURIComponent(req.params.name);
    await accountService.deleteAccount(accountName);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Toggle account status
router.post('/accounts/:name/toggle', adminAuth, async (req, res) => {
  try {
    const accountName = decodeURIComponent(req.params.name);
    await accountService.toggleAccountStatus(accountName);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export { router as adminRouter };