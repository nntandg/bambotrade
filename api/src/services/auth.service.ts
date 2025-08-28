import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const authService = {
    // 用户注册
    async register(username: string, email: string, password: string) {
        // 检查用户名是否已存在
        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        if (existingUser) {
            throw new Error('Username already exists');
        }

        // 检查邮箱是否已存在
        if (email) {
            const existingEmail = await prisma.user.findUnique({
                where: { email }
            });

            if (existingEmail) {
                throw new Error('Email already exists');
            }
        }

        // 哈希密码
        const hashedPassword = await bcrypt.hash(password, 10);

        // 创建用户
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        // 生成JWT令牌
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        };
    },

    // 用户登录
    async login(username: string, password: string) {
        // 查找用户
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            throw new Error('Invalid username or password');
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }

        // 生成JWT令牌
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        };
    },

    // 管理员登录
    async adminLogin(username: string, password: string) {
        // 检查是否为默认管理员
        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(
                { id: 0, username: username, role: 'ADMIN' },
                process.env.JWT_SECRET!,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            return {
                user: {
                    id: 0,
                    username: username,
                    role: 'ADMIN'
                },
                token
            };
        }

        // 查找管理员用户
        const user = await prisma.user.findFirst({
            where: {
                username,
                role: 'ADMIN'
            }
        });

        if (!user) {
            throw new Error('Invalid username or password');
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }

        // 生成JWT令牌
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        return {
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            token
        };
    },

    // 验证JWT令牌
    verifyToken(token: string) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET!) as any;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
};