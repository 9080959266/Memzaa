import { Response } from 'express';
import { Proof } from '../models/Proof.js';
import { PhotoJob } from '../models/PhotoJob.js';
import { Studio } from '../models/Studio.js';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';

export const getMyProofs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const proofs = await Proof.find({ customerId: req.user.id })
      .sort({ updatedAt: -1 })
      .populate('studioId', 'name logoImage phone')
      .populate('photoJobId', 'title jobId stage');

    res.json({
      success: true,
      proofs
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudioProofs = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const proofs = await Proof.find({ studioId })
      .sort({ updatedAt: -1 })
      .populate('customerId', 'name email phone avatar')
      .populate('photoJobId', 'title jobId stage');

    res.json({
      success: true,
      proofs
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProof = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { photoJobId, previewUrls, highResUrls, title } = req.body;

    const photoJob = await PhotoJob.findById(photoJobId);
    if (!photoJob) {
      res.status(404).json({ success: false, message: 'Photo job not found' });
      return;
    }

    const proofSuffix = Math.floor(1000 + Math.random() * 9000);
    const proof = await Proof.create({
      proofId: `MEM-PRF-${proofSuffix}`,
      photoJobId: photoJob._id,
      studioId: photoJob.studioId,
      customerId: photoJob.customerId,
      version: (photoJob.proofVersion || 0) + 1,
      title: title || `${photoJob.title} - Draft Proof v${(photoJob.proofVersion || 0) + 1}`,
      previewUrls,
      highResUrls: highResUrls || previewUrls,
      status: 'pending_review'
    });

    photoJob.stage = 'PROOF_READY';
    photoJob.proofVersion = proof.version;
    photoJob.latestProofUrl = previewUrls[0];
    photoJob.customerApprovalStatus = 'pending';
    await photoJob.save();

    // Customer Notification
    await Notification.create({
      userId: photoJob.customerId,
      title: 'New Edited Photo Proof Ready! ✨',
      message: `Studio uploaded edited proof v${proof.version} for "${photoJob.title}". Review and approve or request changes!`,
      type: 'proof',
      link: '/proofs'
    });

    res.status(201).json({
      success: true,
      message: 'Proof uploaded and customer notified!',
      proof
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewProof = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, customerFeedback, revisionRequests } = req.body; // status: 'approved' | 'changes_requested'

    const proof = await Proof.findById(id).populate('photoJobId');
    if (!proof) {
      res.status(404).json({ success: false, message: 'Proof not found' });
      return;
    }

    proof.status = status;
    if (customerFeedback) proof.customerFeedback = customerFeedback;
    if (revisionRequests) proof.revisionRequests = revisionRequests;
    if (status === 'approved') proof.approvedAt = new Date();
    await proof.save();

    const photoJob: any = proof.photoJobId;
    if (photoJob) {
      if (status === 'approved') {
        photoJob.stage = 'CUSTOMER_APPROVED';
        photoJob.customerApprovalStatus = 'approved';
      } else {
        photoJob.stage = 'EDITING';
        photoJob.customerApprovalStatus = 'changes_requested';
      }
      await photoJob.save();
    }

    // Studio Notification
    const studio = await Studio.findById(proof.studioId);
    if (studio && studio.ownerId) {
      await Notification.create({
        userId: studio.ownerId,
        title: status === 'approved' ? 'Proof Approved by Customer! ✅' : 'Proof Changes Requested ✏️',
        message: `Customer ${status === 'approved' ? 'approved' : 'requested changes for'} proof: "${proof.title}"`,
        type: 'proof',
        link: '/seller/proofs'
      });
    }

    res.json({
      success: true,
      message: status === 'approved' ? 'Proof approved! Proceeding to high-definition printing.' : 'Revision feedback submitted to studio.',
      proof
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
