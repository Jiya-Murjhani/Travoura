import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { createTrip } from '../controllers/tripController';

const router = Router();

router.post('/', authenticateToken, createTrip);

export default router;
