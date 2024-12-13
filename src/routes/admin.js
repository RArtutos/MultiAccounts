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
    const { name, url, maxUsers, platform, icon, tags } = req.body;
    const tagsList = tags ? tags.split(',').map(tag => tag.trim()) : [];
    await accountService.addAccount(name, url, maxUsers, platform, icon, tagsList);
    res.redirect('/admin');
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Actualizar cuenta
router.patch('/accounts/:name', adminAuth, async (req, res) => {
  try {
    const accountName = decodeURIComponent(req.params.name);
    const updates = req.body;
    await accountService.updateAccount(accountName, updates);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Agregar etiqueta
router.post('/accounts/:name/tags', adminAuth, async (req, res) => {
  try {
    const accountName = decodeURIComponent(req.params.name);
    const { tag } = req.body;
    await accountService.addTag(accountName, tag);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar etiqueta
router.delete('/accounts/:name/tags/:tag', adminAuth, async (req, res) => {
  try {
    const accountName = decodeURIComponent(req.params.name);
    const tag = decodeURIComponent(req.params.tag);
    await accountService.removeTag(accountName, tag);
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Resto de las rutas existentes...

export { router as adminRouter };