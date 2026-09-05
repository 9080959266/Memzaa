import { Router, Response } from 'express';
import { Complaint } from '../models/Complaint.js';
import { AuthRequest, authenticateJWT } from '../middleware/auth.js';

const router = Router();

// Create new customer/user complaint ticket
router.post('/', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { subject, description, priority = 'medium', targetType = 'general', targetId } = req.body;
    if (!subject || !description) {
      res.status(400).json({ success: false, message: 'Subject and description are required' });
      return;
    }

    const ticketSuffix = Math.floor(100 + Math.random() * 900);
    const complaint = await Complaint.create({
      ticketId: `MEM-TKT-${ticketSuffix}`,
      userId: req.user.id,
      subject,
      description,
      priority,
      targetType,
      targetId,
      status: 'open',
      messages: [
        {
          senderId: req.user.id,
          senderRole: req.user.role,
          senderName: req.user.name,
          message: description,
          timestamp: new Date()
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket registered successfully',
      complaint
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get logged-in user's complaints
router.get('/my', authenticateJWT, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const complaints = await Complaint.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: complaints.length,
      complaints
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
