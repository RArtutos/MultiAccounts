import { adminRouter } from './admin.js';
import { proxyRouter } from './proxy.js';
import { dashboardRouter } from './dashboard.js';
import { config } from '../config/index.js';

export function setupRoutes(app) {
  // Mount routes based on domain
  app.use((req, res, next) => {
    const host = req.get('host');
    if (host === config.domain.base) {
      next();
    } else {
      proxyRouter(req, res, next);
    }
  });

  // Admin routes
  app.use('/admin', adminRouter);

  // Dashboard routes
  app.use('/dashboard', dashboardRouter);

  // Root redirect
  app.get('/', (req, res) => {
    res.redirect('/dashboard');
  });
}