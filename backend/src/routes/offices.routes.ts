import { Router } from 'express';
import {
  getOffices,
  getOfficeById,
  getUserOffices,
  createOffice,
  updateOffice,
} from '../controllers/offices.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getOffices);
router.get('/:id', authenticate, getOfficeById);
router.post('/', authenticate, createOffice);
router.put('/:id', authenticate, updateOffice);

export default router;

