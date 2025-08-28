import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { logger } from '../utils/logger';

export const userController = {
    // 获取用户信息
    async getProfile(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const user = await userService.getUserById(userId);

            res.json({
                success: true,
                data: user
            });
        } catch (error: any) {
            logger.error('Get profile error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 更新用户信息
    async updateProfile(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const updateData = req.body;
            const user = await userService.updateUser(userId, updateData);

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: user
            });
        } catch (error: any) {
            logger.error('Update profile error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 获取用户订单
    async getUserOrders(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { page = 1, limit = 10, status } = req.query;

            const orders = await userService.getUserOrders(
                userId,
                Number(page),
                Number(limit),
                status as string
            );

            res.json({
                success: true,
                data: orders
            });
        } catch (error: any) {
            logger.error('Get user orders error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
};