import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export const authorizeRoles = (...rolesOrArray: Array<'customer' | 'shop_owner' | 'admin' | Array<'customer' | 'shop_owner' | 'admin'>>) => {
  const allowedRoles = rolesOrArray.flat() as Array<'customer' | 'shop_owner' | 'admin'>;
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
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

export const requireRole = authorizeRoles;

