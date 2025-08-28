import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { loginSchema, registerSchema } from '../utils/validation';

const router = Router();

// 用户注册
router.post('/register', validateRequest(registerSchema), authController.register);

// 用户登录
router.post('/login', validateRequest(loginSchema), authController.login);

// 管理员登录
router.post('/admin/login', validateRequest(loginSchema), authController.adminLogin);

export default router;