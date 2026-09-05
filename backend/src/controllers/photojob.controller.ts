import { Response } from 'express';
import { PhotoJob } from '../models/PhotoJob.js';
import { Studio } from '../models/Studio.js';
import { Order } from '../models/Order.js';
import { Booking } from '../models/Booking.js';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';

export const getStudioKanbanJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    let studioId = req.query.studioId;
    if (req.user.role === 'shop_owner') {
      const studio = await Studio.findOne({ ownerId: req.user.id });
      if (studio) studioId = studio._id.toString();
    }

    const filter: any = {};
    if (studioId) filter.studioId = studioId;

    const jobs = await PhotoJob.find(filter)
      .sort({ updatedAt: -1 })
      .populate('customerId', 'name email phone avatar')
      .populate('bookingId')
      .populate('orderId');

    // Group jobs by Kanban stages
    const stages = [
      'NEW_ORDER',
      'PHOTOS_UPLOADED',
      'EDITING',
      'PROOF_READY',
      'CUSTOMER_APPROVAL',
      'PRINTING',
      'QUALITY_CHECK',
      'READY',
      'DELIVERY',
      'COMPLETED'
    ];

    const kanbanColumns: Record<string, any[]> = {};
    stages.forEach(stage => {
      kanbanColumns[stage] = [];
    });

    jobs.forEach(job => {
      if (kanbanColumns[job.stage]) {
        kanbanColumns[job.stage].push(job);
      } else {
        kanbanColumns['NEW_ORDER'].push(job);
      }
    });

    res.json({
      success: true,
      kanbanColumns,
      totalJobs: jobs.length
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateJobStage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { stage, notes, priority, assignedEditor } = req.body;

    const job = await PhotoJob.findById(id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    if (stage) job.stage = stage;
    if (notes) job.notes = notes;
    if (priority) job.priority = priority;
    if (assignedEditor) job.assignedEditor = assignedEditor;

    await job.save();

    // Synchronize linked Order timeline and status
    if (stage && job.orderId) {
      const order = await Order.findById(job.orderId);
      if (order) {
        order.currentStatus = stage;
        const stepIndex = order.timeline.findIndex(t => t.status === stage);
        if (stepIndex !== -1) {
          for (let i = 0; i <= stepIndex; i++) {
            order.timeline[i].completed = true;
          }
          order.timeline[stepIndex].timestamp = new Date();
          if (notes) order.timeline[stepIndex].description = notes;
        }
        await order.save();
      }
    }

    // Synchronize linked Booking status if completed
    if (stage === 'COMPLETED' && job.bookingId) {
      await Booking.findByIdAndUpdate(job.bookingId, { bookingStatus: 'completed' });
    }

    // Customer Notification
    await Notification.create({
      userId: job.customerId,
      title: `Photo Job Update: ${job.title}`,
      message: `Your photo project is now at stage: ${stage.replace(/_/g, ' ')}`,
      type: 'proof',
      link: '/proofs'
    });

    res.json({
      success: true,
      message: `Job stage updated to ${stage}`,
      job
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadJobPhotos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { photoUrls, stage } = req.body; // array of urls

    const job = await PhotoJob.findById(id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    if (Array.isArray(photoUrls)) {
      photoUrls.forEach(url => {
        job.photos.push({
          url,
          originalName: 'Studio Shoot Upload',
          status: 'uploaded',
          uploadedAt: new Date()
        });
      });
    }

    if (stage) {
      job.stage = stage;
    } else if (job.stage === 'NEW_ORDER') {
      job.stage = 'PHOTOS_UPLOADED';
    }

    await job.save();

    res.json({
      success: true,
      message: `${photoUrls.length} photos added to job`,
      job
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const customerSelectPhotos = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { photoSelections } = req.body; // [{ photoId, status: 'selected'|'rejected', comments }]

    const job = await PhotoJob.findById(id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    if (Array.isArray(photoSelections)) {
      photoSelections.forEach(sel => {
        const photo = job.photos.find(p => p._id?.toString() === sel.photoId);
        if (photo) {
          photo.status = sel.status;
          if (sel.comments) photo.comments = sel.comments;
        }
      });
    }

    job.stage = 'EDITING';
    await job.save();

    res.json({
      success: true,
      message: 'Photo selections saved and submitted for editing!',
      job
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQCChecklist = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { qcChecklist } = req.body;

    const job = await PhotoJob.findById(id);
    if (!job) {
      res.status(404).json({ success: false, message: 'Job not found' });
      return;
    }

    if (qcChecklist) job.qcChecklist = qcChecklist;
    await job.save();

    res.json({
      success: true,
      message: 'Quality check updated',
      job
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
