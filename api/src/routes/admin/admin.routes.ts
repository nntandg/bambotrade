import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';
import { adminController } from '../../controllers/admin/admin.controller';

const router = Router();

// 所有路由都需要管理员认证
router.use(authMiddleware);
router.use(adminMiddleware);

// 获取管理员信息
router.get('/profile', adminController.getProfile);

// 获取仪表盘数据
router.get('/dashboard', adminController.getDashboard);

// 获取管理员日志
router.get('/logs', adminController.getLogs);

export default router;