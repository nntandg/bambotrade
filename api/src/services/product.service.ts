import { PrismaClient } from '@prisma/client';
import { adminService } from './admin.service';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const productService = {
    // 获取商品列表（管理员）
    async getProducts(page: number, limit: number, category?: string, search?: string) {
        const skip = (page - 1) * limit;

        const where: any = {};
        if (category) where.category = category;
        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } }
            ];
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            cards: {
                                where: { isSold: false }
                            }
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where })
        ]);

        return {
            products: products.map(p => ({
                ...p,
                availableStock: p._count.cards
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },

    // 获取商品详情（管理员）
    async getProductById(id: number) {
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        cards: {
                            where: { isSold: false }
                        }
                    }
                }
            }
        });

        if (!product) {
            throw new Error('Product not found');
        }

        return {
            ...product,
            availableStock: product._count.cards
        };
    },

    // 创建商品
    async createProduct(productData: any, adminId: number) {
        const product = await prisma.product.create({
            data: productData
        });

        // 记录操作日志
        await adminService.logAdminAction(adminId, 'CREATE_PRODUCT', product.id);

        return product;
    },

    // 更新商品
    async updateProduct(id: number, updateData: any, adminId: number) {
        const existingProduct = await prisma.product.findUnique({
            where: { id }
        });

        if (!existingProduct) {
            throw new Error('Product not found');
        }

        const product = await prisma.product.update({
            where: { id },
            data: updateData
        });

        // 记录操作日志
        await adminService.logAdminAction(adminId, 'UPDATE_PRODUCT', id);

        return product;
    },

    // 删除商品
    async deleteProduct(id: number, adminId: number) {
        const existingProduct = await prisma.product.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        cards: true,
                        orders: true
                    }
                }
            }
        });

        if (!existingProduct) {
            throw new Error('Product not found');
        }

        // 检查是否有关联的卡密或订单
        if (existingProduct._count.cards > 0 || existingProduct._count.orders > 0) {
            throw new Error('Cannot delete product with associated cards or orders');
        }

        await prisma.product.delete({
            where: { id }
        });

        // 记录操作日志
        await adminService.logAdminAction(adminId, 'DELETE_PRODUCT', id);
    },

    // 获取商品列表（前台）
    async getPublicProducts(page: number, limit: number, category?: string) {
        const skip = (page - 1) * limit;

        const where: any = { isActive: true };
        if (category) where.category = category;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    category: true,
                    stock: true,
                    image: true
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where })
        ]);

        return {
            products,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },

    // 获取商品详情（前台）
    async getPublicProductById(id: number) {
        const product = await prisma.product.findUnique({
            where: { id, isActive: true },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                category: true,
                stock: true,
                image: true,
                createdAt: true
            }
        });

        if (!product) {
            throw new Error('Product not found');
        }

        return product;
    }
};