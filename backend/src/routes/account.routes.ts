import { Router } from 'express';
import { getAccounts, createAccount } from '../controllers/account.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', getAccounts);
router.post('/', createAccount);

export const accountRoutes = router;