import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const userService = {
    // 根据ID获取用户
    async getUserById(id: number) {
        const user = await prisma.user.findUnique({
            where: { id },
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
            throw new Error('User not found');
        }

        return user;
    },

    // 更新用户信息
    async updateUser(id: number, updateData: any) {
        // 不允许更新密码和角色
        const { password, role, ...data } = updateData;

        const user = await prisma.user.update({
            where: { id },
            data
        });

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    },

    // 获取用户订单
    async getUserOrders(userId: number, page: number, limit: number, status?: string) {
        const skip = (page - 1) * limit;

        const where: any = { userId };
        if (status) {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true
                        }
                    },
                    card: {
                        select: {
                            id: true,
                            cardKey: true
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.order.count({ where })
        ]);

        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    }
};