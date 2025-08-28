import { Request, Response } from 'express';
import { productService } from '../../services/product.service';
import { logger } from '../../utils/logger';

export const productController = {
    // 获取商品列表
    async getProducts(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, category, search } = req.query;

            const products = await productService.getProducts(
                Number(page),
                Number(limit),
                category as string,
                search as string
            );

            res.json({
                success: true,
                data: products
            });
        } catch (error: any) {
            logger.error('Get products error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 获取商品详情
    async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(Number(id));

            res.json({
                success: true,
                data: product
            });
        } catch (error: any) {
            logger.error('Get product by id error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 创建商品
    async createProduct(req: Request, res: Response) {
        try {
            const productData = req.body;
            const adminId = (req as any).admin.id;

            const product = await productService.createProduct(productData, adminId);

            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: product
            });
        } catch (error: any) {
            logger.error('Create product error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 更新商品
    async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            const adminId = (req as any).admin.id;

            const product = await productService.updateProduct(Number(id), updateData, adminId);

            res.json({
                success: true,
                message: 'Product updated successfully',
                data: product
            });
        } catch (error: any) {
            logger.error('Update product error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 删除商品
    async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const adminId = (req as any).admin.id;

            await productService.deleteProduct(Number(id), adminId);

            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error: any) {
            logger.error('Delete product error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
};