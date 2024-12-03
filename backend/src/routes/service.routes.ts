import { Router } from 'express';
import { getServices, createService, updateService, deleteService } from '../controllers/service.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getServices);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export const serviceRoutes = router;