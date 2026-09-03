"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticateJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_js_1 = require("../models/User.js");
const authenticateJWT = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'memora_super_secret_jwt_key_2025_moment_create_memories';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Check if user still exists
        const user = await User_js_1.User.findById(decoded.id);
        if (!user || !user.isActive) {
            res.status(401).json({ success: false, message: 'User account not found or deactivated.' });
            return;
        }
        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name
        };
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: 'Invalid or expired session token.', error: error.message });
    }
};
exports.authenticateJWT = authenticateJWT;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const secret = process.env.JWT_SECRET || 'memora_super_secret_jwt_key_2025_moment_create_memories';
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            const user = await User_js_1.User.findById(decoded.id);
            if (user && user.isActive) {
                req.user = {
                    id: user._id.toString(),
                    email: user.email,
                    role: user.role,
                    name: user.name
                };
            }
        }
        next();
    }
    catch {
        // Continue unauthenticated
        next();
    }
};
exports.optionalAuth = optionalAuth;
