import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { generateItinerary } from '../controllers/itineraryController';

const router = Router();

router.post('/generate', authenticateToken, generateItinerary);

export default router;
