import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

// 扩展Request类型
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                username: string;
                role: string;
            };
            admin?: {
                id: number;
                username: string;
                role: string;
            };
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = authService.verifyToken(token);

        // 如果是管理员，设置admin属性
        if (decoded.role === 'ADMIN') {
            req.admin = {
                id: decoded.id,
                username: decoded.username,
                role: decoded.role
            };
        } else {
            // 普通用户
            req.user = {
                id: decoded.id,
                username: decoded.username,
                role: decoded.role
            };
        }

        next();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};