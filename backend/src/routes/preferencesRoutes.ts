import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getPreferences, updatePreferences } from '../controllers/preferencesController';

const router = Router();

router.get('/:userId', authenticateToken, getPreferences);
router.patch('/:userId', authenticateToken, updatePreferences);

export default router;
