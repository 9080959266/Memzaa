"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCustomizerUpload = exports.handleMultipleUpload = exports.handleSingleUpload = void 0;
const handleSingleUpload = (req, res) => {
    if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
        success: true,
        message: 'File uploaded successfully',
        file: {
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            url: fileUrl
        }
    });
};
exports.handleSingleUpload = handleSingleUpload;
const handleMultipleUpload = (req, res) => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        res.status(400).json({ success: false, message: 'No files uploaded' });
        return;
    }
    const files = req.files.map(f => ({
        filename: f.filename,
        originalName: f.originalname,
        mimetype: f.mimetype,
        size: f.size,
        url: `/uploads/${f.filename}`
    }));
    res.json({
        success: true,
        message: `${files.length} files uploaded successfully`,
        files,
        urls: files.map(f => f.url)
    });
};
exports.handleMultipleUpload = handleMultipleUpload;
const handleCustomizerUpload = (req, res) => {
    const files = req.files;
    const photoFile = files?.['photo']?.[0];
    const mockupFile = files?.['mockup']?.[0];
    res.json({
        success: true,
        message: 'Customization assets processed successfully',
        photoUrl: photoFile ? `/uploads/${photoFile.filename}` : undefined,
        mockupUrl: mockupFile ? `/uploads/${mockupFile.filename}` : undefined
    });
};
exports.handleCustomizerUpload = handleCustomizerUpload;
