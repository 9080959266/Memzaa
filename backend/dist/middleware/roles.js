"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Forbidden. Role '${req.user.role}' does not have permission to access this resource.`
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
