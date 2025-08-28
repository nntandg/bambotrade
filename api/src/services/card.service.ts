import { PrismaClient } from '@prisma/client';
import { adminService } from './admin.service';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const cardService = {
    // 获取卡密列表
    async getCards(page: number, limit: number, productId?: number, isSold?: boolean) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (productId) where.productId = productId;
        if (isSold !== undefined) where.isSold = isSold;

        const [cards, total] = await Promise.all([
            prisma.card.findMany({
                where,
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    order: {
                        select: {
                            id: true,
                            status: true
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.card.count({ where })
        ]);

        return {
            cards,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },

    // 获取卡密详情
    async getCardById(id: number) {
        const card = await prisma.card.findUnique({
            where: { id },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                order: {
                    select: {
                        id: true,
                        status: true
                    }
                }
            }
        });

        if (!card) {
            throw new Error('Card not found');
        }

        return card;
    },

    // 创建卡密（单个或批量）
    async createCard(productId: number, cardKeys: string[], adminId: number) {
        // 验证商品是否存在
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            throw new Error('Product not found');
        }

        // 准备卡密数据
        const cardsData = cardKeys.map(cardKey => ({
            productId,
            cardKey: cardKey.trim()
        }));

        // 批量创建卡密
        const result = await prisma.$transaction(async (tx) => {
            const cards = await tx.card.createMany({
                data: cardsData,
                skipDuplicates: true
            });

            // 记录操作日志
            await adminService.logAdminAction(
                adminId,
                'CREATE_CARDS',
                productId,
                `Created ${cards.count} cards for product ${productId}`
            );

            return cards;
        });

        return {
            count: result.count,
            productId
        };
    },

    // 删除卡密
    async deleteCard(id: number, adminId: number) {
        const card = await prisma.card.findUnique({
            where: { id }
        });

        if (!card) {
            throw new Error('Card not found');
        }

        if (card.isSold) {
            throw new Error('Cannot delete sold card');
        }

        await prisma.card.delete({
            where: { id }
        });

        // 记录操作日志
        await adminService.logAdminAction(
            adminId,
            'DELETE_CARD',
            id,
            `Deleted card ${id} for product ${card.productId}`
        );
    }
};