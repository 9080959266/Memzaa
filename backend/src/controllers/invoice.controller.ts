import { Response } from 'express';
import { Invoice } from '../models/Invoice.js';
import { AuthRequest } from '../middleware/auth.js';

export const getInvoiceById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findOne({
      $or: [{ _id: id }, { invoiceNumber: id }, { orderId: id }, { bookingId: id }]
    }).populate('orderId').populate('bookingId');

    if (!invoice) {
      res.status(404).json({ success: false, message: 'Invoice not found' });
      return;
    }

    res.json({
      success: true,
      invoice
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyInvoices = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const invoices = await Invoice.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      invoices
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
