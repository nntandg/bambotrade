import { Request, Response } from 'express';
import { orderService } from '../../services/order.service';
import { logger } from '../../utils/logger';

export const orderController = {
    // 获取订单列表
    async getOrders(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, status, search } = req.query;

            const orders = await orderService.getOrders(
                Number(page),
                Number(limit),
                status as string,
                search as string
            );

            res.json({
                success: true,
                data: orders
            });
        } catch (error: any) {
            logger.error('Get orders error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 获取订单详情
    async getOrderById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const order = await orderService.getOrderById(Number(id));

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

    // 确认收款
    async confirmPayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { transactionId } = req.body;
            const adminId = (req as any).admin.id;

            const order = await orderService.confirmPayment(Number(id), transactionId, adminId);

            res.json({
                success: true,
                message: 'Payment confirmed successfully',
                data: order
            });
        } catch (error: any) {
            logger.error('Confirm payment error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 确认发货
    async confirmDelivery(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const adminId = (req as any).admin.id;

            const result = await orderService.confirmDelivery(Number(id), adminId);

            res.json({
                success: true,
                message: 'Delivery confirmed successfully',
                data: result
            });
        } catch (error: any) {
            logger.error('Confirm delivery error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 取消订单
    async cancelOrder(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const adminId = (req as any).admin.id;

            const order = await orderService.cancelOrder(Number(id), adminId);

            res.json({
                success: true,
                message: 'Order cancelled successfully',
                data: order
            });
        } catch (error: any) {
            logger.error('Cancel order error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
};