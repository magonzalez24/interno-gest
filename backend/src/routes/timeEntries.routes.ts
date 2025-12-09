import { Router } from 'express';
import {
  getTimeEntries,
  getTimeEntryById,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
} from '../controllers/timeEntries.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getTimeEntries);
router.get('/:id', authenticate, getTimeEntryById);
router.post('/', authenticate, createTimeEntry);
router.put('/:id', authenticate, updateTimeEntry);
router.delete('/:id', authenticate, deleteTimeEntry);

export default router;

