import { Router } from 'express';
import {
  handleListMonitors,
  handleCreateMonitor,
  handleGetMonitor,
  handleUpdateMonitor,
  handleDeleteMonitor,
  handlePauseMonitor,
  handleResumeMonitor,
  handleCheckMonitor,
} from '../controllers/monitorController.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

// All monitor routes require authentication
router.use(requireAuth);

router.get('/', handleListMonitors);
router.post('/', handleCreateMonitor);
router.get('/:id', handleGetMonitor);
router.patch('/:id', handleUpdateMonitor);
router.delete('/:id', handleDeleteMonitor);
router.post('/:id/pause', handlePauseMonitor);
router.post('/:id/resume', handleResumeMonitor);
router.post('/:id/check', handleCheckMonitor);

export default router;
