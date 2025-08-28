// 商品详情页JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的商品ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        loadProductDetails(productId);
        loadRelatedProducts(productId);
    } else {
        // 如果没有商品ID，跳转到商品列表页
        window.location.href = 'index.html#products';
    }

    // 标签页切换功能
    initTabs();
});

// 加载商品详情
function loadProductDetails(productId) {
    // 模拟商品数据（实际应用中应从API获取）
    const products = {
        1: {
            id: 1,
            name: "Netflix 1个月会员",
            description: "全球最受欢迎的流媒体服务，提供数千部电影、电视剧和纪录片。支持4K超高清画质，可在手机、平板、电脑、智能电视等多设备同时观看。",
            price: 25.00,
            stock: 50,
            image: "static/images/product1.jpg",
            features: [
                "无广告观看体验",
                "4K超高清画质",
                "支持多设备同时观看",
                "离线下载功能",
                "个性化推荐"
            ],
            details: "Netflix会员可畅享平台所有内容，包括原创剧集、电影、纪录片等。新会员可享受30天免费试用期，之后每月自动续费。"
        },
        2: {
            id: 2,
            name: "Spotify 1个月会员",
            description: "全球领先的音乐流媒体服务，拥有超过5000万首歌曲。支持离线收听、无广告播放、高音质等高级功能。",
            price: 15.00,
            stock: 100,
            image: "static/images/product2.jpg",
            features: [
                "无广告播放",
                "高音质音频",
                "离线收听",
                "无限跳过",
                "个性化歌单"
            ],
            details: "Spotify Premium会员可享受无广告音乐体验，支持高音质音频播放，可下载歌曲离线收听。支持手机、平板、电脑等多设备使用。"
        },
        3: {
            id: 3,
            name: "Adobe Creative Cloud 1个月",
            description: "专业创意设计软件套装，包含Photoshop、Illustrator、Premiere Pro等20多款创意应用。",
            price: 80.00,
            stock: 30,
            image: "static/images/product3.jpg",
            features: [
                "20+创意应用",
                "100GB云存储",
                "Adobe Fonts字体库",
                "Behance作品集",
                "教程与资源"
            ],
            details: "Adobe Creative Cloud包含全套创意软件，适合设计师、摄影师、视频编辑等创意工作者。提供云存储和协作功能，随时随地访问您的作品。"
        }
    };

    const product = products[productId];

    if (product) {
        // 更新页面内容
        document.getElementById('breadcrumb-product').textContent = product.name;
        document.getElementById('main-product-image').src = product.image;
        document.getElementById('product-name').textContent = product.name;
        document.getElementById('product-price').textContent = product.price.toFixed(2);
        document.getElementById('product-stock').textContent = product.stock;
        document.getElementById('product-description').textContent = product.description;
        document.getElementById('details-content').textContent = product.details;

        // 更新购买链接
        const buyButton = document.querySelector('.product-actions .btn-primary');
        buyButton.href = `checkout.html?productId=${product.id}`;

        // 渲染商品特点
        const featuresList = document.getElementById('product-features');
        featuresList.innerHTML = '';
        product.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            featuresList.appendChild(li);
        });
    } else {
        // 商品不存在，显示错误信息
        document.querySelector('.product-container').innerHTML = `
            <div class="error-message">
                <h2>商品不存在</h2>
                <p>您访问的商品可能已下架或ID错误。</p>
                <a href="index.html#products" class="btn btn-primary">返回商品列表</a>
            </div>
        `;
    }
}

// 加载相关商品
function loadRelatedProducts(currentProductId) {
    const relatedGrid = document.getElementById('related-products-grid');

    // 模拟相关商品数据（实际应用中应从API获取）
    const relatedProducts = [
        {
            id: 4,
            name: "YouTube Premium 1个月",
            price: 18.00,
            image: "static/images/product1.jpg"
        },
        {
            id: 5,
            name: "Disney+ 1个月会员",
            price: 22.00,
            image: "static/images/product2.jpg"
        },
        {
            id: 6,
            name: "Steam 100元礼品卡",
            price: 95.00,
            image: "static/images/product3.jpg"
        }
    ];

    // 渲染相关商品
    relatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="price">¥${product.price.toFixed(2)}</span>
                </div>
                <div class="product-actions">
                    <a href="checkout.html?productId=${product.id}" class="btn btn-primary">立即购买</a>
                    <a href="product.html?id=${product.id}" class="btn btn-outline">详情</a>
                </div>
            </div>
        `;
        relatedGrid.appendChild(productCard);
    });
}

// 初始化标签页功能
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // 移除所有活动状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // 添加当前活动状态
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}