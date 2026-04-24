import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getExpenses, createExpense, deleteExpense } from '../controllers/expenseController';

const router = Router({ mergeParams: true });

router.get('/', authenticateToken, getExpenses);
router.post('/', authenticateToken, createExpense);
router.delete('/:expenseId', authenticateToken, deleteExpense);

export default router;
