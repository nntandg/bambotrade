import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import adminRoutes from './admin/admin.routes';
import productRoutes from './admin/product.routes';
import orderRoutes from './admin/order.routes';
import cardRoutes from './admin/card.routes';
import publicProductRoutes from './public/product.routes';
import publicOrderRoutes from './public/order.routes';

export function setupRoutes(app: express.Application) {
    // 健康检查
    app.get('/health', (req, res) => {
        res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API路由
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/admin/products', productRoutes);
    app.use('/api/admin/orders', orderRoutes);
    app.use('/api/admin/cards', cardRoutes);

    // 前台API路由
    app.use('/api/products', publicProductRoutes);
    app.use('/api/orders', publicOrderRoutes);
}