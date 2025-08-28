import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const adminService = {
    // 获取管理员信息
    async getAdminById(id: number) {
        // 如果是默认管理员
        if (id === 0) {
            return {
                id: 0,
                username: process.env.ADMIN_USERNAME,
                role: 'ADMIN'
            };
        }

        const user = await prisma.user.findUnique({
            where: { id, role: 'ADMIN' },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            throw new Error('Admin not found');
        }

        return user;
    },

    // 获取仪表盘数据
    async getDashboardData() {
        const [
            totalProducts,
            todayOrders,
            todayRevenue,
            totalCards,
            pendingOrders,
            lowStockProducts
        ] = await Promise.all([
            // 商品总数
            prisma.product.count({
                where: { isActive: true }
            }),

            // 今日订单数
            prisma.order.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),

            // 今日收入
            prisma.order.aggregate({
                where: {
                    status: 'COMPLETED',
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                },
                _sum: {
                    amount: true
                }
            }),

            // 卡密总数
            prisma.card.count({
                where: { isSold: false }
            }),

            // 待处理订单
            prisma.order.count({
                where: {
                    status: {
                        in: ['PAID', 'CONFIRMED_PAYMENT']
                    }
                }
            }),

            // 库存不足商品
            prisma.product.count({
                where: {
                    isActive: true,
                    stock: {
                        lt: 10
                    }
                }
            })
        ]);

        return {
            totalProducts,
            todayOrders,
            todayRevenue: todayRevenue._sum.amount || 0,
            totalCards,
            pendingOrders,
            lowStockProducts
        };
    },

    // 获取管理员日志
    async getAdminLogs(page: number, limit: number, action?: string, adminId?: number) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (action) where.action = action;
        if (adminId) where.adminId = adminId;

        const [logs, total] = await Promise.all([
            prisma.adminLog.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.adminLog.count({ where })
        ]);

        return {
            logs,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },

    // 记录管理员操作日志
    async logAdminAction(adminId: number, action: string, targetId?: number, details?: string) {
        try {
            await prisma.adminLog.create({
                data: {
                    adminId,
                    action,
                    targetId,
                    details: details || `${action} ${targetId ? `ID: ${targetId}` : ''}`
                }
            });
        } catch (error) {
            logger.error('Failed to log admin action:', error);
        }
    }
};