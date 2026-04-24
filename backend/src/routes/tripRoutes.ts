import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { createTrip, getUserTrips, getTripById, updateTrip, deleteTrip } from '../controllers/tripController';

const router = Router();

router.post('/', authenticateToken, createTrip);
router.get('/', authenticateToken, getUserTrips);
router.get('/:id', authenticateToken, getTripById);
router.put('/:id', authenticateToken, updateTrip);
router.delete('/:id', authenticateToken, deleteTrip);

export default router;
