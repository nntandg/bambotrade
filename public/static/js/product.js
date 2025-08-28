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
async function loadProductDetails(productId) {
  try {
    // 从API获取商品详情
    const response = await fetch(`https://api.pengbo.qzz.io/api/products/${productId}`);
    const data = await response.json();
    
    if (data.success) {
      const product = data.data;
      
      // 更新页面内容
      document.getElementById('breadcrumb-product').textContent = product.name;
      document.getElementById('main-product-image').src = product.image || 'static/images/product1.jpg';
      document.getElementById('product-name').textContent = product.name;
      document.getElementById('product-price').textContent = product.price.toFixed(2);
      document.getElementById('product-stock').textContent = product.stock || 0;
      document.getElementById('product-description').textContent = product.description || '';
      document.getElementById('details-content').textContent = product.details || '';
      
      // 更新购买链接
      const buyButton = document.querySelector('.product-actions .btn-primary');
      buyButton.href = `checkout.html?productId=${product.id}`;
      
      // 渲染商品特点
      const featuresList = document.getElementById('product-features');
      if (featuresList && product.features) {
        featuresList.innerHTML = '';
        product.features.forEach(feature => {
          const li = document.createElement('li');
          li.textContent = feature;
          featuresList.appendChild(li);
        });
      }
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
  } catch (error) {
    console.error('Load product details error:', error);
    document.querySelector('.product-container').innerHTML = `
      <div class="error-message">
        <h2>加载失败</h2>
        <p>无法加载商品信息，请稍后重试。</p>
        <a href="index.html#products" class="btn btn-primary">返回商品列表</a>
      </div>
    `;
  }
}

// 加载相关商品
async function loadRelatedProducts(currentProductId) {
  const relatedGrid = document.getElementById('related-products-grid');
  
  try {
    // 从API获取相关商品（这里使用相同的商品列表作为示例）
    const response = await fetch('https://api.pengbo.qzz.io/api/products');
    const data = await response.json();
    
    if (data.success) {
      // 过滤掉当前商品，只显示其他商品
      const relatedProducts = data.data.products.filter(p => p.id !== parseInt(currentProductId)).slice(0, 3);
      
      relatedGrid.innerHTML = '';
      relatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
          <div class="product-image">
            <img src="${product.image || 'static/images/product1.jpg'}" alt="${product.name}">
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
  } catch (error) {
    console.error('Load related products error:', error);
  }
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
