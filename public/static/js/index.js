// 首页JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 加载商品列表
    loadProducts();

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// 加载商品列表
function loadProducts() {
    const productGrid = document.getElementById('product-grid');

    // 模拟商品数据（实际应用中应从API获取）
    const products = [
        {
            id: 1,
            name: "Netflix 1个月会员",
            description: "全球最受欢迎的流媒体服务，高清无广告观看体验",
            price: 25.00,
            stock: 50,
            image: "static/images/product1.jpg"
        },
        {
            id: 2,
            name: "Spotify 1个月会员",
            description: "全球领先的音乐流媒体服务，千万歌曲随心听",
            price: 15.00,
            stock: 100,
            image: "static/images/product2.jpg"
        },
        {
            id: 3,
            name: "Adobe Creative Cloud 1个月",
            description: "专业创意设计软件套装，包含Photoshop、Illustrator等",
            price: 80.00,
            stock: 30,
            image: "static/images/product3.jpg"
        },
        {
            id: 4,
            name: "YouTube Premium 1个月",
            description: "无广告观看YouTube视频，支持后台播放和下载",
            price: 18.00,
            stock: 75,
            image: "static/images/product1.jpg"
        },
        {
            id: 5,
            name: "Disney+ 1个月会员",
            description: "迪士尼旗下流媒体服务，漫威、星球大战等独家内容",
            price: 22.00,
            stock: 60,
            image: "static/images/product2.jpg"
        },
        {
            id: 6,
            name: "Steam 100元礼品卡",
            description: "全球最大PC游戏平台礼品卡，购买游戏、DLC等",
            price: 95.00,
            stock: 200,
            image: "static/images/product3.jpg"
        }
    ];

    // 清空加载提示
    productGrid.innerHTML = '';

    // 渲染商品卡片
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">¥${product.price.toFixed(2)}</span>
                    <span class="stock">库存: ${product.stock}</span>
                </div>
                <div class="product-actions">
                    <a href="checkout.html?productId=${product.id}" class="btn btn-primary">立即购买</a>
                    <a href="product.html?id=${product.id}" class="btn btn-outline">详情</a>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}