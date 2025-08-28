import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { userController } from '../controllers/user.controller';

const router = Router();

// 所有路由都需要认证
router.use(authMiddleware);

// 获取用户信息
router.get('/profile', userController.getProfile);

// 更新用户信息
router.put('/profile', userController.updateProfile);

// 获取用户订单
router.get('/orders', userController.getUserOrders);

export default router;