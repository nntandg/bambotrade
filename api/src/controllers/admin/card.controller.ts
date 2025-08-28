import { Request, Response } from 'express';
import { cardService } from '../../services/card.service';
import { logger } from '../../utils/logger';

export const cardController = {
    // 获取卡密列表
    async getCards(req: Request, res: Response) {
        try {
            const { page = 1, limit = 20, productId, isSold } = req.query;

            const cards = await cardService.getCards(
                Number(page),
                Number(limit),
                productId ? Number(productId) : undefined,
                isSold !== undefined ? Boolean(isSold) : undefined
            );

            res.json({
                success: true,
                data: cards
            });
        } catch (error: any) {
            logger.error('Get cards error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 获取卡密详情
    async getCardById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const card = await cardService.getCardById(Number(id));

            res.json({
                success: true,
                data: card
            });
        } catch (error: any) {
            logger.error('Get card by id error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 创建卡密（单个或批量）
    async createCard(req: Request, res: Response) {
        try {
            const { productId, cardKeys } = req.body;
            const adminId = (req as any).admin.id;

            const result = await cardService.createCard(productId, cardKeys, adminId);

            res.status(201).json({
                success: true,
                message: `Successfully created ${result.count} cards`,
                data: result
            });
        } catch (error: any) {
            logger.error('Create card error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },

    // 删除卡密
    async deleteCard(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const adminId = (req as any).admin.id;

            await cardService.deleteCard(Number(id), adminId);

            res.json({
                success: true,
                message: 'Card deleted successfully'
            });
        } catch (error: any) {
            logger.error('Delete card error:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
};