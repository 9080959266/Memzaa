"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCustomizerUpload = exports.handleMultipleUpload = exports.handleSingleUpload = void 0;
const cloudinary_js_1 = require("../config/cloudinary.js");
const Photo_js_1 = require("../models/Photo.js");
const handleSingleUpload = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }
        const folder = req.body.category === 'proof' ? 'memora_proofs' : 'memora_photos';
        const uploadResult = await (0, cloudinary_js_1.uploadToCloudinary)(req.file.path, folder);
        let photoDoc = null;
        if (req.user) {
            photoDoc = await Photo_js_1.Photo.create({
                user: req.user.id,
                name: req.file.originalname,
                url: uploadResult.url,
                thumbnailUrl: uploadResult.url,
                publicId: uploadResult.publicId,
                size: uploadResult.bytes || req.file.size,
                mimeType: req.file.mimetype,
                dimensions: {
                    width: uploadResult.width || 1920,
                    height: uploadResult.height || 1080,
                },
                category: req.body.category || 'uploaded',
                orderId: req.body.orderId || undefined,
                bookingId: req.body.bookingId || undefined,
                photoJobId: req.body.photoJobId || undefined,
            });
        }
        res.json({
            success: true,
            message: 'File uploaded successfully to cloud storage',
            file: {
                id: photoDoc?._id,
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: uploadResult.bytes || req.file.size,
                url: uploadResult.url,
                publicId: uploadResult.publicId,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.handleSingleUpload = handleSingleUpload;
const handleMultipleUpload = async (req, res) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            res.status(400).json({ success: false, message: 'No files uploaded' });
            return;
        }
        const folder = req.body.category === 'proof' ? 'memora_proofs' : 'memora_photos';
        const uploadPromises = req.files.map(async (f) => {
            const uploadResult = await (0, cloudinary_js_1.uploadToCloudinary)(f.path, folder);
            let photoDoc = null;
            if (req.user) {
                photoDoc = await Photo_js_1.Photo.create({
                    user: req.user.id,
                    name: f.originalname,
                    url: uploadResult.url,
                    thumbnailUrl: uploadResult.url,
                    publicId: uploadResult.publicId,
                    size: uploadResult.bytes || f.size,
                    mimeType: f.mimetype,
                    dimensions: {
                        width: uploadResult.width || 1920,
                        height: uploadResult.height || 1080,
                    },
                    category: req.body.category || 'uploaded',
                    orderId: req.body.orderId || undefined,
                    bookingId: req.body.bookingId || undefined,
                    photoJobId: req.body.photoJobId || undefined,
                });
            }
            return {
                id: photoDoc?._id,
                filename: f.filename,
                originalName: f.originalname,
                mimetype: f.mimetype,
                size: uploadResult.bytes || f.size,
                url: uploadResult.url,
                publicId: uploadResult.publicId,
            };
        });
        const uploadedFiles = await Promise.all(uploadPromises);
        res.json({
            success: true,
            message: `${uploadedFiles.length} files uploaded successfully to cloud storage`,
            files: uploadedFiles,
            urls: uploadedFiles.map((f) => f.url),
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.handleMultipleUpload = handleMultipleUpload;
const handleCustomizerUpload = async (req, res) => {
    try {
        const files = req.files;
        const photoFile = files?.['photo']?.[0];
        const mockupFile = files?.['mockup']?.[0];
        let photoUrl;
        let mockupUrl;
        if (photoFile) {
            const resPhoto = await (0, cloudinary_js_1.uploadToCloudinary)(photoFile.path, 'memora_customizer');
            photoUrl = resPhoto.url;
            if (req.user) {
                await Photo_js_1.Photo.create({
                    user: req.user.id,
                    name: photoFile.originalname,
                    url: photoUrl,
                    thumbnailUrl: photoUrl,
                    publicId: resPhoto.publicId,
                    size: resPhoto.bytes || photoFile.size,
                    mimeType: photoFile.mimetype,
                    category: 'used_in_order',
                });
            }
        }
        if (mockupFile) {
            const resMockup = await (0, cloudinary_js_1.uploadToCloudinary)(mockupFile.path, 'memora_mockups');
            mockupUrl = resMockup.url;
        }
        res.json({
            success: true,
            message: 'Customization assets processed successfully',
            photoUrl,
            mockupUrl,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.handleCustomizerUpload = handleCustomizerUpload;
