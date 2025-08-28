import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { adminMiddleware } from '../../middleware/admin.middleware';
import { cardController } from '../../controllers/admin/card.controller';
import { validateRequest } from '../../middleware/validate.middleware';
import { createCardSchema } from '../../utils/validation';

const router = Router();

// 所有路由都需要管理员认证
router.use(authMiddleware);
router.use(adminMiddleware);

// 获取卡密列表
router.get('/', cardController.getCards);

// 获取卡密详情
router.get('/:id', cardController.getCardById);

// 创建卡密（单个或批量）
router.post('/', validateRequest(createCardSchema), cardController.createCard);

// 删除卡密
router.delete('/:id', cardController.deleteCard);

export default router;