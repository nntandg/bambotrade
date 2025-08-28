import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { logger } from '../utils/logger';

export const productController = {
    // 获取商品列表（前台）
    async getPublicProducts(req: Request, res: Response) {
        try {
            const { page = 1, limit = 10, category } = req.query;

            const products = await productService.getPublicProducts(
                Number(page),
                Number(limit),
                category as string
            );

            res.json({
                success: true,
                data: products
            });
        } catch (error: any) {
            logger.error('Get public products error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 获取商品详情（前台）
    async getPublicProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await productService.getPublicProductById(Number(id));

            res.json({
                success: true,
                data: product
            });
        } catch (error: any) {
            logger.error('Get public product by id error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
};