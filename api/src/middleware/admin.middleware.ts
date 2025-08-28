import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin) {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    next();
};