import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { orderController } from '../../controllers/order.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { createOrderSchema } from '../../utils/validation';

const router = Router();

// 创建订单（前台）
router.post('/', validateRequest(createOrderSchema), orderController.createOrder);

// 获取订单详情（前台）
router.get('/:id', authMiddleware, orderController.getOrderById);

// 获取用户订单列表（前台）
router.get('/', authMiddleware, orderController.getUserOrders);

export default router;