// 由于 Cloudflare Workers 有一些限制，我们需要调整后端代码
// 这里提供一个简化版本

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // 路由处理
        if (url.pathname === '/api/health') {
            return new Response(JSON.stringify({ status: 'OK' }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 代理到其他服务（如果需要）
        if (url.pathname.startsWith('/api/')) {
            // 这里可以连接到 D1 数据库或外部服务
            return handleApiRequest(request, env);
        }

        // 默认响应
        return new Response('Not Found', { status: 404 });
    }
};

async function handleApiRequest(request: Request, env: Env): Promise<Response> {
    // 简化的API处理逻辑
    // 实际项目中需要根据具体需求实现
    return new Response(JSON.stringify({ message: 'API endpoint' }), {
        headers: { 'Content-Type': 'application/json' }
    });
}