import { Router } from 'express';
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleGetMe,
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, handleRegister);
router.post('/login', authRateLimiter, handleLogin);
router.post('/logout', requireAuth, handleLogout);
router.get('/me', requireAuth, handleGetMe);

export default router;
