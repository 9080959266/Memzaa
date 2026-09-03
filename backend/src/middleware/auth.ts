import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'customer' | 'shop_owner' | 'admin';
    name: string;
  };
}

export const authenticateJWT = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'memora_super_secret_jwt_key_2025_moment_create_memories';

    const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string; name: string };
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
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
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token.', error: error.message });
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'memora_super_secret_jwt_key_2025_moment_create_memories';
      const decoded = jwt.verify(token, secret) as { id: string; email: string; role: string; name: string };
      const user = await User.findById(decoded.id);
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
  } catch {
    // Continue unauthenticated
    next();
  }
};
