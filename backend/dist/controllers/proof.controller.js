"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewProof = exports.createProof = exports.getStudioProofs = exports.getMyProofs = void 0;
const Proof_js_1 = require("../models/Proof.js");
const PhotoJob_js_1 = require("../models/PhotoJob.js");
const Studio_js_1 = require("../models/Studio.js");
const Notification_js_1 = require("../models/Notification.js");
const getMyProofs = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const proofs = await Proof_js_1.Proof.find({ customerId: req.user.id })
            .sort({ updatedAt: -1 })
            .populate('studioId', 'name logoImage phone')
            .populate('photoJobId', 'title jobId stage');
        res.json({
            success: true,
            proofs
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyProofs = getMyProofs;
const getStudioProofs = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        let studioId = req.query.studioId;
        if (req.user.role === 'shop_owner') {
            const studio = await Studio_js_1.Studio.findOne({ ownerId: req.user.id });
            if (studio)
                studioId = studio._id.toString();
        }
        const proofs = await Proof_js_1.Proof.find({ studioId })
            .sort({ updatedAt: -1 })
            .populate('customerId', 'name email phone avatar')
            .populate('photoJobId', 'title jobId stage');
        res.json({
            success: true,
            proofs
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getStudioProofs = getStudioProofs;
const createProof = async (req, res) => {
    try {
        const { photoJobId, previewUrls, highResUrls, title } = req.body;
        const photoJob = await PhotoJob_js_1.PhotoJob.findById(photoJobId);
        if (!photoJob) {
            res.status(404).json({ success: false, message: 'Photo job not found' });
            return;
        }
        const proofSuffix = Math.floor(1000 + Math.random() * 9000);
        const proof = await Proof_js_1.Proof.create({
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
        await Notification_js_1.Notification.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createProof = createProof;
const reviewProof = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, customerFeedback, revisionRequests } = req.body; // status: 'approved' | 'changes_requested'
        const proof = await Proof_js_1.Proof.findById(id).populate('photoJobId');
        if (!proof) {
            res.status(404).json({ success: false, message: 'Proof not found' });
            return;
        }
        proof.status = status;
        if (customerFeedback)
            proof.customerFeedback = customerFeedback;
        if (revisionRequests)
            proof.revisionRequests = revisionRequests;
        if (status === 'approved')
            proof.approvedAt = new Date();
        await proof.save();
        const photoJob = proof.photoJobId;
        if (photoJob) {
            if (status === 'approved') {
                photoJob.stage = 'CUSTOMER_APPROVED';
                photoJob.customerApprovalStatus = 'approved';
            }
            else {
                photoJob.stage = 'EDITING';
                photoJob.customerApprovalStatus = 'changes_requested';
            }
            await photoJob.save();
        }
        // Studio Notification
        const studio = await Studio_js_1.Studio.findById(proof.studioId);
        if (studio && studio.ownerId) {
            await Notification_js_1.Notification.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.reviewProof = reviewProof;
