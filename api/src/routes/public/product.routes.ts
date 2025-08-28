import { Router } from 'express';
import { productController } from '../../controllers/product.controller';

const router = Router();

// 获取商品列表（前台）
router.get('/', productController.getPublicProducts);

// 获取商品详情（前台）
router.get('/:id', productController.getPublicProductById);

export default router;