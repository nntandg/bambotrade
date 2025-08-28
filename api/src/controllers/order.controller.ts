import { Request, Response } from 'express';
import { orderService } from '../services/order.service';
import { logger } from '../utils/logger';

export const orderController = {
    // 创建订单（前台）
    async createOrder(req: Request, res: Response) {
        try {
            const orderData = req.body;
            const userId = (req as any).user?.id; // 可选，游客也可以下单

            const order = await orderService.createOrder({
                ...orderData,
                userId
            });

            res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: order
            });
        } catch (error: any) {
            logger.error('Create order error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 获取订单详情（前台）
    async getOrderById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userId = (req as any).user?.id;

            const order = await orderService.getOrderById(Number(id), userId);

            res.json({
                success: true,
                data: order
            });
        } catch (error: any) {
            logger.error('Get order by id error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 获取用户订单列表（前台）
    async getUserOrders(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            const { page = 1, limit = 10, status } = req.query;

            const orders = await orderService.getUserOrders(
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