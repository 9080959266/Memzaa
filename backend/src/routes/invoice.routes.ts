import { Router } from 'express';
import { getInvoiceById, getMyInvoices } from '../controllers/invoice.controller.js';
import { authenticateJWT } from '../middleware/auth.js';

const router = Router();

router.get('/my-invoices', authenticateJWT, getMyInvoices);
router.get('/:id', authenticateJWT, getInvoiceById);

export default router;
