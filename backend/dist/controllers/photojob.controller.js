"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQCChecklist = exports.customerSelectPhotos = exports.uploadJobPhotos = exports.updateJobStage = exports.getStudioKanbanJobs = void 0;
const PhotoJob_js_1 = require("../models/PhotoJob.js");
const Studio_js_1 = require("../models/Studio.js");
const Notification_js_1 = require("../models/Notification.js");
const getStudioKanbanJobs = async (req, res) => {
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
        const filter = {};
        if (studioId)
            filter.studioId = studioId;
        const jobs = await PhotoJob_js_1.PhotoJob.find(filter)
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
        const kanbanColumns = {};
        stages.forEach(stage => {
            kanbanColumns[stage] = [];
        });
        jobs.forEach(job => {
            if (kanbanColumns[job.stage]) {
                kanbanColumns[job.stage].push(job);
            }
            else {
                kanbanColumns['NEW_ORDER'].push(job);
            }
        });
        res.json({
            success: true,
            kanbanColumns,
            totalJobs: jobs.length
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getStudioKanbanJobs = getStudioKanbanJobs;
const updateJobStage = async (req, res) => {
    try {
        const { id } = req.params;
        const { stage, notes, priority, assignedEditor } = req.body;
        const job = await PhotoJob_js_1.PhotoJob.findById(id);
        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found' });
            return;
        }
        if (stage)
            job.stage = stage;
        if (notes)
            job.notes = notes;
        if (priority)
            job.priority = priority;
        if (assignedEditor)
            job.assignedEditor = assignedEditor;
        await job.save();
        // Customer Notification
        await Notification_js_1.Notification.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateJobStage = updateJobStage;
const uploadJobPhotos = async (req, res) => {
    try {
        const { id } = req.params;
        const { photoUrls, stage } = req.body; // array of urls
        const job = await PhotoJob_js_1.PhotoJob.findById(id);
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
        }
        else if (job.stage === 'NEW_ORDER') {
            job.stage = 'PHOTOS_UPLOADED';
        }
        await job.save();
        res.json({
            success: true,
            message: `${photoUrls.length} photos added to job`,
            job
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.uploadJobPhotos = uploadJobPhotos;
const customerSelectPhotos = async (req, res) => {
    try {
        const { id } = req.params;
        const { photoSelections } = req.body; // [{ photoId, status: 'selected'|'rejected', comments }]
        const job = await PhotoJob_js_1.PhotoJob.findById(id);
        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found' });
            return;
        }
        if (Array.isArray(photoSelections)) {
            photoSelections.forEach(sel => {
                const photo = job.photos.find(p => p._id?.toString() === sel.photoId);
                if (photo) {
                    photo.status = sel.status;
                    if (sel.comments)
                        photo.comments = sel.comments;
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
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.customerSelectPhotos = customerSelectPhotos;
const updateQCChecklist = async (req, res) => {
    try {
        const { id } = req.params;
        const { qcChecklist } = req.body;
        const job = await PhotoJob_js_1.PhotoJob.findById(id);
        if (!job) {
            res.status(404).json({ success: false, message: 'Job not found' });
            return;
        }
        if (qcChecklist)
            job.qcChecklist = qcChecklist;
        await job.save();
        res.json({
            success: true,
            message: 'Quality check updated',
            job
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateQCChecklist = updateQCChecklist;
