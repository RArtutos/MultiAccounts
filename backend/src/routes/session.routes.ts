import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

// Session routes will be implemented later
router.get('/', (req, res) => {
  res.json({ sessions: [] });
});

export const sessionRoutes = router;