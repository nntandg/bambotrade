import Joi from 'joi';

// 用户注册验证
export const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).required()
});

// 登录验证
export const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

// 创建商品验证
export const createProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().optional(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).required(),
    category: Joi.string().optional(),
    isActive: Joi.boolean().default(true)
});

// 更新商品验证
export const updateProductSchema = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    stock: Joi.number().integer().min(0).optional(),
    category: Joi.string().optional(),
    isActive: Joi.boolean().optional()
});

// 创建订单验证
export const createOrderSchema = Joi.object({
    productId: Joi.number().integer().positive().required(),
    paymentMethod: Joi.string().valid('wechat', 'usdt').required(),
    note: Joi.string().optional()
});

// 确认收款验证
export const confirmPaymentSchema = Joi.object({
    transactionId: Joi.string().optional()
});

// 创建卡密验证
export const createCardSchema = Joi.object({
    productId: Joi.number().integer().positive().required(),
    cardKeys: Joi.array().items(Joi.string().trim()).min(1).required()
});