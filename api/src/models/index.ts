// 这个文件将由Prisma自动生成，这里只是一个占位符
// 实际使用时运行 `npx prisma generate` 会生成真正的类型定义

export interface User {
    id: number;
    username: string;
    email?: string;
    password: string;
    role: 'USER' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;
}

export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface Card {
    id: number;
    productId: number;
    cardKey: string;
    isSold: boolean;
    orderId?: number;
    createdAt: Date;
}

export interface Order {
    id: number;
    userId?: number;
    productId: number;
    cardId?: number;
    amount: number;
    status: 'PENDING_PAYMENT' | 'PAID' | 'CONFIRMED_PAYMENT' | 'COMPLETED' | 'CANCELLED';
    paymentMethod: string;
    note?: string;
    transactionId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AdminLog {
    id: number;
    adminId: number;
    action: string;
    targetId?: number;
    details: string;
    createdAt: Date;
}

export interface Setting {
    id: number;
    key: string;
    value: string;
    updatedAt: Date;
}