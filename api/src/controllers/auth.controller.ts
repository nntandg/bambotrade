import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

export const authController = {
    // 用户注册
    async register(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;
            const result = await authService.register(username, email, password);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: result
            });
        } catch (error: any) {
            logger.error('Registration error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 用户登录
    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const result = await authService.login(username, password);

            res.json({
                success: true,
                message: 'Login successful',
                data: result
            });
        } catch (error: any) {
            logger.error('Login error:', error);
            res.status(401).json({
                success: false,
                error: error.message
            });
        }
    },

    // 管理员登录
    async adminLogin(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const result = await authService.adminLogin(username, password);

            res.json({
                success: true,
                message: 'Admin login successful',
                data: result
            });
        } catch (error: any) {
            logger.error('Admin login error:', error);
            res.status(401).json({
                success: false,
                error: error.message
            });
        }
    }
};