import { Router } from 'express';
import {
  getProjectInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
} from '../controllers/invoices.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/:projectId/invoices', authenticate, getProjectInvoices);
router.get('/invoices/:id', authenticate, getInvoiceById);
router.post('/:projectId/invoices', authenticate, createInvoice);
router.put('/invoices/:id', authenticate, updateInvoice);
router.delete('/invoices/:id', authenticate, deleteInvoice);

export default router;

