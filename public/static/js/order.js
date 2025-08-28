// 订单详情页JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取URL参数中的订单ID
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    if (orderId) {
        loadOrderDetails(orderId);
        setupRefreshButton();
        setupCopyButton();
    } else {
        // 如果没有订单ID，跳转到首页
        window.location.href = 'index.html';
    }
});

// 加载订单详情
async function loadOrderDetails(orderId) {
  try {
    // 从API获取订单详情
    const response = await fetch(`https://api.pengbo.qzz.io/api/orders/${orderId}`);
    const data = await response.json();
    
    if (data.success) {
      const order = data.data;
      
      // 更新订单信息
      document.getElementById('order-id').textContent = order.id;
      document.getElementById('order-time').textContent = new Date(order.created_at).toLocaleString();
      document.getElementById('payment-method').textContent = order.paymentMethod === 'wechat' ? '微信支付' : 'USDT支付';
      document.getElementById('product-price').textContent = `¥${order.amount.toFixed(2)}`;
      document.getElementById('paid-amount').textContent = `¥${order.amount.toFixed(2)}`;
      
      // 更新商品信息
      const productInfo = document.getElementById('product-info');
      productInfo.innerHTML = `
        <div class="product-image">
          <img src="${order.product_image || 'static/images/product1.jpg'}" alt="${order.product_name}">
        </div>
        <div class="product-info-details">
          <h3>${order.product_name}</h3>
        </div>
      `;
      
      // 更新订单状态
      updateOrderStatus(order);
      
      // 如果有交易号，显示交易号
      if (order.transaction_id) {
        document.getElementById('transaction-id').textContent = order.transaction_id;
        document.getElementById('transaction-row').style.display = 'flex';
      }
      
      // 如果有卡密，显示卡密
      if (order.card_key) {
        document.getElementById('card-key').textContent = order.card_key;
      }
    } else {
      // 订单不存在，显示错误信息
      document.querySelector('.order-container').innerHTML = `
        <div class="error-message">
          <h2>订单不存在</h2>
          <p>您访问的订单可能不存在或ID错误。</p>
          <a href="index.html" class="btn btn-primary">返回首页</a>
        </div>
      `;
    }
  } catch (error) {
    console.error('Load order details error:', error);
    document.querySelector('.order-container').innerHTML = `
      <div class="error-message">
        <h2>加载失败</h2>
        <p>无法加载订单信息，请稍后重试。</p>
        <a href="index.html" class="btn btn-primary">返回首页</a>
      </div>
    `;
  }
}

// 更新订单状态显示
function updateOrderStatus(order) {
  const statusElement = document.getElementById('order-status');
  const actionPanels = {
    'payment-pending': document.getElementById('payment-pending'),
    'payment-confirmed': document.getElementById('payment-confirmed'),
    'order-completed': document.getElementById('order-completed'),
    'order-cancelled': document.getElementById('order-cancelled')
  };
  
  // 隐藏所有操作面板
  Object.values(actionPanels).forEach(panel => {
    panel.style.display = 'none';
  });
  
  // 根据订单状态显示相应的面板
  switch (order.status) {
    case 'PENDING_PAYMENT':
      statusElement.textContent = '待支付';
      statusElement.className = 'status pending';
      actionPanels['payment-pending'].style.display = 'block';
      break;
    case 'PAID':
      statusElement.textContent = '已支付待确认';
      statusElement.className = 'status paid';
      actionPanels['payment-pending'].style.display = 'block';
      break;
    case 'CONFIRMED_PAYMENT':
      statusElement.textContent = '已确认收款';
      statusElement.className = 'status confirmed';
      actionPanels['payment-confirmed'].style.display = 'block';
      break;
    case 'COMPLETED':
      statusElement.textContent = '已完成';
      statusElement.className = 'status completed';
      actionPanels['order-completed'].style.display = 'block';
      break;
    case 'CANCELLED':
      statusElement.textContent = '已取消';
      statusElement.className = 'status cancelled';
      actionPanels['order-cancelled'].style.display = 'block';
      break;
  }
}

// 设置刷新按钮
function setupRefreshButton() {
  const refreshButtons = document.querySelectorAll('#refresh-status');
  
  refreshButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const orderId = new URLSearchParams(window.location.search).get('id');
      
      // 显示加载状态
      this.textContent = '刷新中...';
      this.disabled = true;
      
      // 重新加载订单详情
      await loadOrderDetails(orderId);
      
      // 恢复按钮状态
      this.textContent = '刷新状态';
      this.disabled = false;
    });
  });
}
// 更新订单状态显示
function updateOrderStatus(order) {
    const statusElement = document.getElementById('order-status');
    const actionPanels = {
        'payment-pending': document.getElementById('payment-pending'),
        'payment-confirmed': document.getElementById('payment-confirmed'),
        'order-completed': document.getElementById('order-completed'),
        'order-cancelled': document.getElementById('order-cancelled')
    };

    // 隐藏所有操作面板
    Object.values(actionPanels).forEach(panel => {
        panel.style.display = 'none';
    });

    // 根据订单状态显示相应的面板
    switch (order.status) {
        case 'PENDING_PAYMENT':
            statusElement.textContent = '待支付';
            statusElement.className = 'status pending';
            actionPanels['payment-pending'].style.display = 'block';
            break;
        case 'PAID':
            statusElement.textContent = '已支付待确认';
            statusElement.className = 'status paid';
            actionPanels['payment-pending'].style.display = 'block';
            break;
        case 'CONFIRMED_PAYMENT':
            statusElement.textContent = '已确认收款';
            statusElement.className = 'status confirmed';
            actionPanels['payment-confirmed'].style.display = 'block';
            break;
        case 'COMPLETED':
            statusElement.textContent = '已完成';
            statusElement.className = 'status completed';
            actionPanels['order-completed'].style.display = 'block';
            break;
        case 'CANCELLED':
            statusElement.textContent = '已取消';
            statusElement.className = 'status cancelled';
            actionPanels['order-cancelled'].style.display = 'block';
            break;
    }
}

// 设置刷新按钮
function setupRefreshButton() {
    const refreshButtons = document.querySelectorAll('#refresh-status');

    refreshButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = new URLSearchParams(window.location.search).get('id');

            // 显示加载状态
            this.textContent = '刷新中...';
            this.disabled = true;

            // 模拟API请求延迟
            setTimeout(() => {
                // 重新加载订单详情
                loadOrderDetails(orderId);

                // 恢复按钮状态
                this.textContent = '刷新状态';
                this.disabled = false;
            }, 1000);
        });
    });
}

// 设置复制卡密按钮
function setupCopyButton() {
    const copyButton = document.getElementById('copy-key');

    if (copyButton) {
        copyButton.addEventListener('click', function() {
            const cardKey = document.getElementById('card-key').textContent;

            // 复制到剪贴板
            navigator.clipboard.writeText(cardKey).then(() => {
                // 显示复制成功提示
                const originalText = this.textContent;
                this.textContent = '已复制!';
                this.classList.add('btn-success');

                // 2秒后恢复按钮状态
                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('btn-success');
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动复制卡密');
            });
        });
    }
}
