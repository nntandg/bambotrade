import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';
import { setupRoutes } from './routes';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
    origin: process.env.SITE_URL || 'http://localhost:3000',
    credentials: true
}));

// 请求限制
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100 // 限制每个IP最多100个请求
});
app.use(limiter);

// 日志中间件
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// 解析请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static('uploads'));

// 设置路由
setupRoutes(app);

// 错误处理中间件
app.use(errorHandler);

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// 启动服务器
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

export default app;