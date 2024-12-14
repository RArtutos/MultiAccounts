import express from 'express';
import { adminRouter } from './admin.js';
import { proxyRouter } from './proxy.js';
import { dashboardRouter } from './dashboard.js';
import { config } from '../config/index.js';

export const router = express.Router();

// Middleware para determinar el tipo de ruta basado en el dominio
router.use((req, res, next) => {
  const host = req.get('host');
  const isMainDomain = host === config.domain.base;

  if (isMainDomain) {
    // Rutas principales
    if (req.path === '/') {
      return res.redirect('/dashboard');
    }
    if (req.path.startsWith('/admin')) {
      return adminRouter(req, res, next);
    }
    if (req.path.startsWith('/dashboard')) {
      return dashboardRouter(req, res, next);
    }
  } else {
    // Rutas de proxy para subdominios
    return proxyRouter(req, res, next);
  }
  
  next();
});

// Montar rutas específicas
router.use('/admin', adminRouter);
router.use('/dashboard', dashboardRouter);