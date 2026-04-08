import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '@/utils/logger';
import { RedisService } from '@/services/RedisService';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, jwtSecret) as any;

    // Check Redis ban flag so a newly-banned user can't keep using their existing JWT
    // until it naturally expires (up to JWT_EXPIRY, default 1 h).
    // Fail open on Redis unavailability — the DB is checked at account-sensitive operations.
    try {
      const redis = RedisService.getInstance().getClient();
      const isBanned = await redis.get(`user_banned:${decoded.id}`);
      if (isBanned) {
        return res.status(403).json({ error: 'Account is banned.' });
      }
    } catch {
      // Redis unavailable — proceed; ban takes full effect on next JWT renewal.
    }

    req.user = decoded;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const optionalAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const jwtSecret = process.env.JWT_SECRET;
      if (jwtSecret) {
        const decoded = jwt.verify(token, jwtSecret) as any;
        req.user = decoded;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
