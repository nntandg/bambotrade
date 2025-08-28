import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';
import { productController } from '../../controllers/admin/product.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { createProductSchema, updateProductSchema } from '../../utils/validation';

const router = Router();

// 所有路由都需要管理员认证
router.use(authMiddleware);
router.use(adminMiddleware);

// 获取商品列表
router.get('/', productController.getProducts);

// 获取商品详情
router.get('/:id', productController.getProductById);

// 创建商品
router.post('/', validateRequest(createProductSchema), productController.createProduct);

// 更新商品
router.put('/:id', validateRequest(updateProductSchema), productController.updateProduct);

// 删除商品
router.delete('/:id', productController.deleteProduct);

export default router;