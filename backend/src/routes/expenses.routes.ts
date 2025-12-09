import { Router } from 'express';
import {
  getProjectExpenses,
  getProjectExpenseById,
  createProjectExpense,
  updateProjectExpense,
  deleteProjectExpense,
} from '../controllers/expenses.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:projectId/expenses', authenticate, getProjectExpenses);
router.get('/expenses/:id', authenticate, getProjectExpenseById);
router.post('/:projectId/expenses', authenticate, createProjectExpense);
router.put('/expenses/:id', authenticate, updateProjectExpense);
router.delete('/expenses/:id', authenticate, deleteProjectExpense);

export default router;

