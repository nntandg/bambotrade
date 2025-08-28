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
async function loadProducts() {
  const productGrid = document.getElementById('product-grid');
  
  try {
    // 从API获取商品数据
    const response = await fetch('https://api.pengbo.qzz.io/api/products');
    const data = await response.json();
    
    if (data.success) {
      // 清空加载提示
      productGrid.innerHTML = '';
      
      // 渲染商品卡片
      data.data.products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
          <div class="product-image">
            <img src="${product.image || 'static/images/product1.jpg'}" alt="${product.name}">
          </div>
          <div class="product-info">
            <h3>${product.name}</h3>
            <p>${product.description || ''}</p>
            <div class="product-price">
              <span class="price">¥${product.price.toFixed(2)}</span>
              <span class="stock">库存: ${product.stock || 0}</span>
            </div>
            <div class="product-actions">
              <a href="checkout.html?productId=${product.id}" class="btn btn-primary">立即购买</a>
              <a href="product.html?id=${product.id}" class="btn btn-outline">详情</a>
            </div>
          </div>
        `;
        productGrid.appendChild(productCard);
      });
    } else {
      productGrid.innerHTML = `<div class="error">加载商品失败: ${data.error}</div>`;
    }
  } catch (error) {
    console.error('Load products error:', error);
    productGrid.innerHTML = '<div class="error">网络错误，请稍后重试</div>';
  }
}
