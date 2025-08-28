import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';
import { orderController } from '../../controllers/admin/order.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { confirmPaymentSchema } from '../../utils/validation';

const router = Router();

// 所有路由都需要管理员认证
router.use(authMiddleware);
router.use(adminMiddleware);

// 获取订单列表
router.get('/', orderController.getOrders);

// 获取订单详情
router.get('/:id', orderController.getOrderById);

// 确认收款
router.post('/:id/confirm-payment', validateRequest(confirmPaymentSchema), orderController.confirmPayment);

// 确认发货
router.post('/:id/confirm-delivery', orderController.confirmDelivery);

// 取消订单
router.post('/:id/cancel', orderController.cancelOrder);

export default router;