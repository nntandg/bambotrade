import { Request, Response } from 'express';
import { adminService } from '../../services/admin.service';
import { logger } from '../../utils/logger';

export const adminController = {
    // 获取管理员信息
    async getProfile(req: Request, res: Response) {
        try {
            const adminId = (req as any).admin.id;
            const admin = await adminService.getAdminById(adminId);

            res.json({
                success: true,
                data: admin
            });
        } catch (error: any) {
            logger.error('Get admin profile error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 获取仪表盘数据
    async getDashboard(req: Request, res: Response) {
        try {
            const dashboard = await adminService.getDashboardData();

            res.json({
                success: true,
                data: dashboard
            });
        } catch (error: any) {
            logger.error('Get dashboard error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 获取管理员日志
    async getLogs(req: Request, res: Response) {
        try {
            const { page = 1, limit = 20, action, adminId } = req.query;

            const logs = await adminService.getAdminLogs(
                Number(page),
                Number(limit),
                action as string,
                adminId ? Number(adminId) : undefined
            );

            res.json({
                success: true,
                data: logs
            });
        } catch (error: any) {
            logger.error('Get admin logs error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
};