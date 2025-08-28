import dotenv from 'dotenv';

dotenv.config();

export const config = {
    // 数据库配置
    database: {
        url: process.env.DATABASE_URL
    },

    // JWT配置
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    },

    // 应用配置
    app: {
        port: parseInt(process.env.PORT || '3001'),
        env: process.env.NODE_ENV || 'development'
    },

    // 管理员配置
    admin: {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD
    },

    // 站点配置
    site: {
        url: process.env.SITE_URL || 'http://localhost:3000'
    },

    // 文件上传配置
    upload: {
        path: process.env.UPLOAD_PATH || './uploads',
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB
    },

    // 日志配置
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
};

export default config;