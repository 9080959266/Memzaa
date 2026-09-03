"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error('💥 Server Error:', err);
    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val) => val.message);
        res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: messages
        });
        return;
    }
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        res.status(400).json({
            success: false,
            message: `A record with this ${field} already exists.`
        });
        return;
    }
    // CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        res.status(400).json({
            success: false,
            message: `Resource not found with invalid id format: ${err.value}`
        });
        return;
    }
    // Multer errors
    if (err.name === 'MulterError') {
        res.status(400).json({
            success: false,
            message: `File upload error: ${err.message}`
        });
        return;
    }
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};
exports.errorHandler = errorHandler;
