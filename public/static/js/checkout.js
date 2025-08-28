// 结算页面JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的商品ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    if (productId) {
        loadProductInfo(productId);
        setupPaymentMethodToggle();
        setupOrderSubmission();
    } else {
        // 如果没有商品ID，跳转到商品列表页
        window.location.href = 'index.html#products';
    }
});

// 加载商品信息
async function loadProductInfo(productId) {
  try {
    // 从API获取商品信息
    const response = await fetch(`https://api.pengbo.qzz.io/api/products/${productId}`);
    const data = await response.json();
    
    if (data.success) {
      const product = data.data;
      
      // 更新商品信息
      const productInfo = document.getElementById('product-info');
      productInfo.innerHTML = `
        <div class="product-image">
          <img src="${product.image || 'static/images/product1.jpg'}" alt="${product.name}">
        </div>
        <div class="product-info-details">
          <h3>${product.name}</h3>
          <p>${product.description || ''}</p>
          <div class="product-price">
            <span class="price">¥${product.price.toFixed(2)}</span>
          </div>
        </div>
      `;
      
      // 更新订单摘要
      updateOrderSummary(product.price);
    } else {
      // 商品不存在，显示错误信息
      document.querySelector('.checkout-container').innerHTML = `
        <div class="error-message">
          <h2>商品不存在</h2>
          <p>您访问的商品可能已下架或ID错误。</p>
          <a href="index.html#products" class="btn btn-primary">返回商品列表</a>
        </div>
      `;
    }
  } catch (error) {
    console.error('Load product info error:', error);
    document.querySelector('.checkout-container').innerHTML = `
      <div class="error-message">
        <h2>加载失败</h2>
        <p>无法加载商品信息，请稍后重试。</p>
        <a href="index.html#products" class="btn btn-primary">返回商品列表</a>
      </div>
    `;
  }
}

// 更新订单摘要
function updateOrderSummary(productPrice) {
  const discount = 0; // 可以根据促销活动计算折扣
  const total = productPrice - discount;
  
  document.getElementById('summary-price').textContent = `¥${productPrice.toFixed(2)}`;
  document.getElementById('summary-discount').textContent = `-¥${discount.toFixed(2)}`;
  document.getElementById('summary-total').textContent = `¥${total.toFixed(2)}`;
  document.getElementById('payment-amount').textContent = `¥${total.toFixed(2)}`;
}

// 设置订单提交
function setupOrderSubmission() {
  const submitButton = document.getElementById('submit-order');
  
  submitButton.addEventListener('click', async function(e) {
    e.preventDefault();
    
    // 获取表单数据
    const productId = new URLSearchParams(window.location.search).get('productId');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const orderNote = document.getElementById('order-note').value;
    
    // 显示加载状态
    submitButton.textContent = '处理中...';
    submitButton.disabled = true;
    
    try {
      // 发送订单创建请求
      const response = await fetch('https://api.pengbo.qzz.io/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: parseInt(productId),
          paymentMethod,
          note: orderNote
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 显示成功消息
        alert(`订单创建成功！订单号: ${data.data.id}\n请扫码支付后联系管理员确认收款。`);
        
        // 跳转到订单详情页
        window.location.href = `order.html?id=${data.data.id}`;
      } else {
        // 显示错误消息
        alert('订单创建失败: ' + data.error);
      }
    } catch (error) {
      console.error('Create order error:', error);
      alert('订单创建失败，请检查网络连接');
    } finally {
      // 恢复按钮状态
      submitButton.textContent = '提交订单';
      submitButton.disabled = false;
    }
  });
}

// 更新订单摘要
function updateOrderSummary(productPrice) {
    const discount = 0; // 可以根据促销活动计算折扣
    const total = productPrice - discount;

    document.getElementById('summary-price').textContent = `¥${productPrice.toFixed(2)}`;
    document.getElementById('summary-discount').textContent = `-¥${discount.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `¥${total.toFixed(2)}`;
    document.getElementById('payment-amount').textContent = `¥${total.toFixed(2)}`;
}

// 设置支付方式切换
function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const wechatQr = document.getElementById('wechat-qr');
    const usdtQr = document.getElementById('usdt-qr');

    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'wechat') {
                wechatQr.classList.add('active');
                usdtQr.classList.remove('active');
            } else {
                wechatQr.classList.remove('active');
                usdtQr.classList.add('active');
            }
        });
    });
}

// 设置订单提交
function setupOrderSubmission() {
    const submitButton = document.getElementById('submit-order');
    const orderForm = document.querySelector('.checkout-form');

    submitButton.addEventListener('click', function(e) {
        e.preventDefault();

        // 获取表单数据
        const productId = new URLSearchParams(window.location.search).get('productId');
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        const orderNote = document.getElementById('order-note').value;

        // 模拟订单创建（实际应用中应发送到API）
        const orderData = {
            productId: parseInt(productId),
            paymentMethod: paymentMethod,
            note: orderNote,
            amount: parseFloat(document.getElementById('summary-total').textContent.replace('¥', ''))
        };

        // 显示加载状态
        submitButton.textContent = '处理中...';
        submitButton.disabled = true;

        // 模拟API请求延迟
        setTimeout(() => {
            // 模拟订单创建成功
            const orderId = Math.floor(Math.random() * 1000000) + 100000;

            // 显示成功消息
            alert(`订单创建成功！订单号: ${orderId}\n请扫码支付后联系管理员确认收款。`);

            // 跳转到订单详情页
            window.location.href = `order.html?id=${orderId}`;

            // 恢复按钮状态
            submitButton.textContent = '提交订单';
            submitButton.disabled = false;
        }, 1500);
    });
}
