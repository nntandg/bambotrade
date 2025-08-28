// 管理后台JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
    // 检查当前页面并初始化相应功能
    const currentPath = window.location.pathname;
    const pageName = currentPath.split('/').pop().replace('.html', '');

    // 检查管理员登录状态
    checkAdminLogin();

    // 根据页面初始化功能
    switch (pageName) {
        case 'login':
            initLoginPage();
            break;
        case 'index':
            initDashboard();
            break;
        case 'products':
            initProductsPage();
            break;
        case 'orders':
            initOrdersPage();
            break;
        case 'cards':
            initCardsPage();
            break;
        case 'settings':
            initSettingsPage();
            break;
    }

    // 通用功能
    initLogout();
});

// 检查管理员登录状态
function checkAdminLogin() {
    const currentPage = window.location.pathname.split('/').pop();

    // 如果不是登录页面且没有登录令牌，跳转到登录页
    if (currentPage !== 'login.html' && !localStorage.getItem('adminToken')) {
        window.location.href = 'login.html';
        return;
    }

    // 如果是登录页面且已有登录令牌，跳转到仪表盘
    if (currentPage === 'login.html' && localStorage.getItem('adminToken')) {
        window.location.href = 'index.html';
        return;
    }
}


// 初始化登录页面
function initLoginPage() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('https://api.pengbo.qzz.io/api/auth/admin/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    // 保存登录令牌
                    localStorage.setItem('adminToken', data.data.token);
                    localStorage.setItem('adminUsername', data.data.user.username);

                    // 跳转到仪表盘
                    window.location.href = 'index.html';
                } else {
                    // 显示错误消息
                    alert('用户名或密码错误！');
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('登录失败，请检查网络连接');
            }
        });
    }
}

// 初始化仪表盘
async function initDashboard() {
    // 更新管理员用户名
    const adminUsername = localStorage.getItem('adminUsername') || 'admin';
    document.getElementById('admin-username').textContent = adminUsername;

    try {
        // 从API获取仪表盘数据
        const response = await fetch('https://api.pengbo.qzz.io/api/admin/dashboard', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            }
        });
        const data = await response.json();

        if (data.success) {
            const stats = data.data;

            // 更新统计数据
            document.getElementById('total-products').textContent = stats.totalProducts;
            document.getElementById('today-orders').textContent = stats.todayOrders;
            document.getElementById('today-revenue').textContent = `¥${stats.todayRevenue.toFixed(2)}`;
            document.getElementById('total-cards').textContent = stats.totalCards;
        } else {
            console.error('Load dashboard error:', data.error);
        }

        // 加载待处理订单
        await loadPendingOrders();

        // 加载库存不足商品
        await loadLowStockProducts();
    } catch (error) {
        console.error('Init dashboard error:', error);
        // 如果token无效，跳转到登录页
        localStorage.removeItem('adminToken');
        window.location.href = 'login.html';
    }
}


// 加载待处理订单
async function loadPendingOrders() {
    const pendingOrdersTable = document.getElementById('pending-orders');

    try {
        const response = await fetch('https://api.pengbo.qzz.io/api/admin/orders?status=PAID', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            }
        });
        const data = await response.json();

        if (data.success) {
            pendingOrdersTable.innerHTML = '';

            data.data.orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.product_name}</td>
          <td>¥${order.amount.toFixed(2)}</td>
          <td><span class="status ${order.status.toLowerCase()}">${getStatusText(order.status)}</span></td>
          <td>
            <button class="action-btn btn-success" onclick="confirmPayment(${order.id})">确认收款</button>
          </td>
        `;
                pendingOrdersTable.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Load pending orders error:', error);
    }
}

// 加载库存不足商品
async function loadLowStockProducts() {
    const lowStockTable = document.getElementById('low-stock-products');

    try {
        const response = await fetch('https://api.pengbo.qzz.io/api/products', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            }
        });
        const data = await response.json();

        if (data.success) {
            const lowStockProducts = data.data.products.filter(p => p.stock < 10);

            lowStockTable.innerHTML = '';
            lowStockProducts.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
          <td>${product.name}</td>
          <td>${product.stock}</td>
          <td>
            <a href="products.html" class="action-btn btn-primary">管理库存</a>
          </td>
        `;
                lowStockTable.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Load low stock products error:', error);
    }
}

// 初始化商品管理页面
async function initProductsPage() {
    // 更新管理员用户名
    const adminUsername = localStorage.getItem('adminUsername') || 'admin';
    document.getElementById('admin-username').textContent = adminUsername;

    // 加载商品列表
    await loadProducts();

    // 初始化添加商品按钮
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            showProductModal();
        });
    }
}


// 加载商品列表
async function loadProducts() {
    const productsTable = document.getElementById('products-tbody');

    try {
        const response = await fetch('https://api.pengbo.qzz.io/api/admin/products', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            }
        });
        const data = await response.json();

        if (data.success) {
            productsTable.innerHTML = '';

            data.data.products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
          <td>${product.id}</td>
          <td>${product.name}</td>
          <td>${product.description || ''}</td>
          <td>¥${product.price.toFixed(2)}</td>
          <td>${product.stock}</td>
          <td>${product.is_active ? '启用' : '禁用'}</td>
          <td>${new Date(product.created_at).toLocaleDateString()}</td>
          <td>
            <button class="action-btn btn-primary" onclick="editProduct(${product.id})">编辑</button>
            <button class="action-btn btn-danger" onclick="deleteProduct(${product.id})">删除</button>
          </td>
        `;
                productsTable.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Load products error:', error);
    }
}
// 显示商品模态框
function showProductModal(product = null) {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('product-form');

    if (product) {
        // 编辑模式
        modalTitle.textContent = '编辑商品';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-active').checked = product.isActive;
    } else {
        // 添加模式
        modalTitle.textContent = '添加商品';
        form.reset();
        document.getElementById('product-id').value = '';
    }

    modal.classList.add('show');
}

// 关闭商品模态框
function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('show');
}

// 保存商品
function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        category: document.getElementById('product-category').value,
        isActive: document.getElementById('product-active').checked
    };

    // 模拟保存操作（实际应用中应发送到API）
    console.log('保存商品:', productId ? '编辑' : '添加', productData);

    // 显示成功消息
    alert(productId ? '商品更新成功！' : '商品添加成功！');

    // 关闭模态框
    closeProductModal();

    // 重新加载商品列表
    loadProducts();
}

// 编辑商品
function editProduct(productId) {
    // 模拟获取商品数据（实际应用中应从API获取）
    const product = {
        id: productId,
        name: "Netflix 1个月会员",
        description: "全球最受欢迎的流媒体服务",
        price: 25.00,
        stock: 50,
        category: "视频会员",
        isActive: true
    };

    showProductModal(product);
}

// 删除商品
function deleteProduct(productId) {
    if (confirm('确定要删除这个商品吗？')) {
        // 模拟删除操作（实际应用中应发送到API）
        console.log('删除商品:', productId);

        // 显示成功消息
        alert('商品删除成功！');

        // 重新加载商品列表
        loadProducts();
    }
}

// 初始化订单管理页面
async function initOrdersPage() {
    // 更新管理员用户名
    const adminUsername = localStorage.getItem('adminUsername') || 'admin';
    document.getElementById('admin-username').textContent = adminUsername;

    // 加载订单列表
    await loadOrders();

    // 初始化搜索和筛选
    const searchBtn = document.getElementById('search-btn');
    const statusFilter = document.getElementById('status-filter');

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            loadOrders();
        });
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            loadOrders();
        });
    }
}

    // 初始化确认收款模态框
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', function() {
            confirmPayment();
        });
    }

    // 初始化确认发货模态框
    const confirmDeliveryBtn = document.getElementById('confirm-delivery-btn');
    if (confirmDeliveryBtn) {
        confirmDeliveryBtn.addEventListener('click', function() {
            confirmDelivery();
        });
    }

    // 初始化模态框关闭按钮
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
        });
    });
}


// 加载订单列表
async function loadOrders() {
    const ordersTable = document.getElementById('orders-tbody');
    const statusFilter = document.getElementById('status-filter').value;
    const searchInput = document.getElementById('search-input').value;

    try {
        let url = 'https://api.pengbo.qzz.io/api/admin/orders?';
        const params = new URLSearchParams();

        if (statusFilter) params.append('status', statusFilter);
        if (searchInput) params.append('search', searchInput);

        const response = await fetch(url + params.toString(), {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            }
        });
        const data = await response.json();

        if (data.success) {
            ordersTable.innerHTML = '';

            data.data.orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
          <td>${order.id}</td>
          <td>${order.username || '游客'}</td>
          <td>${order.product_name}</td>
          <td>¥${order.amount.toFixed(2)}</td>
          <td>${order.payment_method === 'wechat' ? '微信' : 'USDT'}</td>
          <td><span class="status ${order.status.toLowerCase()}">${getStatusText(order.status)}</span></td>
          <td>${new Date(order.created_at).toLocaleString()}</td>
          <td>
            ${order.status === 'PAID' ?
                    `<button class="action-btn btn-success confirm-payment-btn" data-id="${order.id}">确认收款</button>` :
                    order.status === 'CONFIRMED_PAYMENT' ?
                        `<button class="action-btn btn-primary confirm-delivery-btn" data-id="${order.id}">确认发货</button>` :
                        '-'
                }
          </td>
        `;
                ordersTable.appendChild(row);
            });

            // 重新绑定确认收款按钮事件
            document.querySelectorAll('.confirm-payment-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const orderId = this.getAttribute('data-id');
                    showConfirmPaymentModal(orderId);
                });
            });

            // 重新绑定确认发货按钮事件
            document.querySelectorAll('.confirm-delivery-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const orderId = this.getAttribute('data-id');
                    showConfirmDeliveryModal(orderId);
                });
            });
        }
    } catch (error) {
        console.error('Load orders error:', error);
    }
}
// 显示确认收款模态框
function showConfirmPaymentModal(orderId) {
    const modal = document.getElementById('confirm-payment-modal');
    const order = getOrderById(orderId);

    if (order) {
        document.getElementById('modal-order-id').textContent = orderId;
        document.getElementById('modal-order-amount').textContent = `¥${order.amount.toFixed(2)}`;
        document.getElementById('transaction-id').value = '';

        modal.classList.add('show');
    }
}

// 显示确认发货模态框
function showConfirmDeliveryModal(orderId) {
    const modal = document.getElementById('confirm-delivery-modal');
    const order = getOrderById(orderId);

    if (order) {
        document.getElementById('modal-delivery-order-id').textContent = orderId;
        document.getElementById('modal-delivery-product').textContent = order.productName;

        modal.classList.add('show');
    }
}

// 确认收款
async function confirmPayment(orderId) {
    const transactionId = document.getElementById('transaction-id').value;

    try {
        const response = await fetch(`https://api.pengbo.qzz.io/api/admin/orders/${orderId}/confirm-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            },
            body: JSON.stringify({ transactionId })
        });

        const data = await response.json();

        if (data.success) {
            alert('确认收款成功！');
            document.getElementById('confirm-payment-modal').style.display = 'none';
            loadOrders();
        } else {
            alert('确认收款失败: ' + data.error);
        }
    } catch (error) {
        console.error('Confirm payment error:', error);
        alert('确认收款失败: ' + error.message);
    }
}

// 确认发货
async function confirmDelivery(orderId) {
    try {
        const response = await fetch(`https://api.pengbo.qzz.io/api/admin/orders/${orderId}/confirm-delivery`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('adminToken')
            }
        });

        const data = await response.json();

        if (data.success) {
            alert('确认发货成功！卡密: ' + data.data.cardKey);
            document.getElementById('confirm-delivery-modal').style.display = 'none';
            loadOrders();
        } else {
            alert('确认发货失败: ' + data.error);
        }
    } catch (error) {
        console.error('Confirm delivery error:', error);
        alert('确认发货失败: ' + error.message);
    }
}

// 初始化卡密管理页面
function initCardsPage() {
    // 更新管理员用户名
    const adminUsername = localStorage.getItem('adminUsername') || 'admin';
    document.getElementById('admin-username').textContent = adminUsername;

    // 加载卡密列表
    loadCards();

    // 加载商品筛选器
    loadProductFilter();

    // 初始化添加卡密按钮
    const addCardBtn = document.getElementById('add-card-btn');
    if (addCardBtn) {
        addCardBtn.addEventListener('click', function() {
            showCardModal();
        });
    }

    // 初始化导入卡密按钮
    const importCardsBtn = document.getElementById('import-cards-btn');
    if (importCardsBtn) {
        importCardsBtn.addEventListener('click', function() {
            showCardModal(true);
        });
    }

    // 初始化卡密表单
    const cardForm = document.getElementById('card-form');
    if (cardForm) {
        cardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveCard();
        });
    }

    // 初始化商品筛选器
    const productFilter = document.getElementById('product-filter');
    if (productFilter) {
        productFilter.addEventListener('change', function() {
            loadCards();
        });
    }

    // 初始化模态框关闭按钮
    const cancelBtn = document.querySelector('#card-modal .cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            closeCardModal();
        });
    }
}

// 加载卡密列表
function loadCards() {
    const cardsTable = document.getElementById('cards-tbody');
    const productFilter = document.getElementById('product-filter').value;

    // 模拟卡密数据（实际应用中应从API获取）
    let cards = [
        {
            id: 1,
            productName: "Netflix 1个月会员",
            cardKey: "NETFLIX-1MONTH-ABC123-XYZ789",
            isSold: false,
            orderId: null,
            createdAt: "2023-06-15T10:00:00Z"
        },
        {
            id: 2,
            productName: "Netflix 1个月会员",
            cardKey: "NETFLIX-1MONTH-DEF456-UVW012",
            isSold: true,
            orderId: 123456,
            createdAt: "2023-06-14T15:00:00Z"
        },
        {
            id: 3,
            productName: "Spotify 1个月会员",
            cardKey: "SPOTIFY-1MONTH-GHI789-RST345",
            isSold: false,
            orderId: null,
            createdAt: "2023-06-13T09:00:00Z"
        }
    ];

    // 应用商品筛选
    if (productFilter) {
        cards = cards.filter(card => card.productName.includes(productFilter));
    }

    cardsTable.innerHTML = '';

    cards.forEach(card => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${card.id}</td>
            <td>${card.productName}</td>
            <td>${card.cardKey}</td>
            <td>${card.isSold ? '已售出' : '未售出'}</td>
            <td>${card.orderId || '-'}</td>
            <td>${new Date(card.createdAt).toLocaleDateString()}</td>
            <td>
                ${!card.isSold ?
            `<button class="action-btn btn-danger" onclick="deleteCard(${card.id})">删除</button>` :
            '-'
        }
            </td>
        `;
        cardsTable.appendChild(row);
    });
}

// 加载商品筛选器
function loadProductFilter() {
    const productFilter = document.getElementById('product-filter');

    // 模拟商品数据（实际应用中应从API获取）
    const products = [
        { id: 1, name: "Netflix 1个月会员" },
        { id: 2, name: "Spotify 1个月会员" },
        { id: 3, name: "Adobe Creative Cloud 1个月" }
    ];

    // 添加空选项
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '所有商品';
    productFilter.appendChild(emptyOption);

    // 添加商品选项
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        productFilter.appendChild(option);
    });

    // 同时加载卡密模态框中的商品选择器
    const cardProductSelect = document.getElementById('card-product');
    if (cardProductSelect) {
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = product.name;
            cardProductSelect.appendChild(option);
        });
    }
}

// 显示卡密模态框
function showCardModal(isImport = false) {
    const modal = document.getElementById('card-modal');
    const form = document.getElementById('card-form');
    const helpText = form.querySelector('.help-text');

    // 重置表单
    form.reset();

    // 根据模式调整界面
    if (isImport) {
        helpText.textContent = '每行一个卡密，批量导入时使用';
        document.getElementById('card-key').setAttribute('rows', '10');
    } else {
        helpText.textContent = '输入单个卡密';
        document.getElementById('card-key').setAttribute('rows', '3');
    }

    modal.classList.add('show');
}

// 关闭卡密模态框
function closeCardModal() {
    const modal = document.getElementById('card-modal');
    modal.classList.remove('show');
}

// 保存卡密
function saveCard() {
    const productId = document.getElementById('card-product').value;
    const cardKeys = document.getElementById('card-key').value.trim().split('\n').filter(key => key);

    // 模拟保存操作（实际应用中应发送到API）
    console.log('保存卡密:', productId, cardKeys);

    // 显示成功消息
    alert(`成功添加 ${cardKeys.length} 个卡密！`);

    // 关闭模态框
    closeCardModal();

    // 重新加载卡密列表
    loadCards();
}

// 删除卡密
function deleteCard(cardId) {
    if (confirm('确定要删除这个卡密吗？')) {
        // 模拟删除操作（实际应用中应发送到API）
        console.log('删除卡密:', cardId);

        // 显示成功消息
        alert('卡密删除成功！');

        // 重新加载卡密列表
        loadCards();
    }
}

// 初始化系统设置页面
function initSettingsPage() {
    // 更新管理员用户名
    const adminUsername = localStorage.getItem('adminUsername') || 'admin';
    document.getElementById('admin-username').textContent = adminUsername;

    // 初始化标签页切换
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

    // 初始化支付设置表单
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePaymentSettings();
        });
    }

    // 初始化网站设置表单
    const siteForm = document.getElementById('site-form');
    if (siteForm) {
        siteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSiteSettings();
        });
    }

    // 初始化添加管理员表单
    const addAdminForm = document.getElementById('add-admin-form');
    if (addAdminForm) {
        addAdminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addAdmin();
        });
    }

    // 初始化二维码上传按钮
    const wechatQrBtn = document.querySelector('#payment .qr-upload button');
    if (wechatQrBtn) {
        wechatQrBtn.addEventListener('click', function() {
            document.getElementById('wechat-qr-upload').click();
        });
    }

    const usdtQrBtn = document.querySelectorAll('#payment .qr-upload button')[1];
    if (usdtQrBtn) {
        usdtQrBtn.addEventListener('click', function() {
            document.getElementById('usdt-qr-upload').click();
        });
    }

    // 初始化二维码上传预览
    const wechatQrUpload = document.getElementById('wechat-qr-upload');
    if (wechatQrUpload) {
        wechatQrUpload.addEventListener('change', function(e) {
            previewQrCode(e.target, 'wechat-qr-preview');
        });
    }

    const usdtQrUpload = document.getElementById('usdt-qr-upload');
    if (usdtQrUpload) {
        usdtQrUpload.addEventListener('change', function(e) {
            previewQrCode(e.target, 'usdt-qr-preview');
        });
    }
}

// 预览二维码
function previewQrCode(input, previewId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            document.getElementById(previewId).src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// 保存支付设置
function savePaymentSettings() {
    // 模拟保存操作（实际应用中应发送到API）
    console.log('保存支付设置');

    // 显示成功消息
    alert('支付设置保存成功！');
}

// 保存网站设置
function saveSiteSettings() {
    // 模拟保存操作（实际应用中应发送到API）
    console.log('保存网站设置');

    // 显示成功消息
    alert('网站设置保存成功！');
}

// 添加管理员
function addAdmin() {
    const username = document.getElementById('new-admin-username').value;
    const password = document.getElementById('new-admin-password').value;
    const role = document.getElementById('new-admin-role').value;

    // 模拟添加操作（实际应用中应发送到API）
    console.log('添加管理员:', username, password, role);

    // 显示成功消息
    alert('管理员添加成功！');

    // 重置表单
    document.getElementById('add-admin-form').reset();
}

// 初始化退出登录
function initLogout() {
    const logoutBtn = document.getElementById('logout');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (confirm('确定要退出登录吗？')) {
                // 清除登录令牌
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUsername');

                // 跳转到登录页
                window.location.href = 'login.html';
            }
        });
    }
}


// 辅助函数：获取订单状态文本
function getStatusText(status) {
    const statusMap = {
        'PENDING_PAYMENT': '待支付',
        'PAID': '已支付待确认',
        'CONFIRMED_PAYMENT': '已收款待发货',
        'COMPLETED': '已完成',
        'CANCELLED': '已取消'
    };
    return statusMap[status] || status;
}

// 辅助函数：根据ID获取订单
function getOrderById(orderId) {
    // 模拟获取订单数据（实际应用中应从API获取）
    const orders = {
        123456: {
            id: 123456,
            productName: "Netflix 1个月会员",
            amount: 25.00
        },
        123457: {
            id: 123457,
            productName: "Spotify 1个月会员",
            amount: 15.00
        },
        123458: {
            id: 123458,
            productName: "Adobe Creative Cloud 1个月",
            amount: 80.00
        }
    };

    return orders[orderId];
}

// 全局函数：确认收款（用于仪表盘）
function confirmPayment(orderId) {
    if (confirm(`确定要确认订单 ${orderId} 的收款吗？`)) {
        // 模拟确认收款操作
        console.log('确认收款:', orderId);

        // 显示成功消息
        alert('确认收款成功！');

        // 重新加载待处理订单
        loadPendingOrders();
    }
}

// 全局函数：确认发货（用于仪表盘）
function confirmDelivery(orderId) {
    if (confirm(`确定要确认订单 ${orderId} 的发货吗？`)) {
        // 模拟确认发货操作
        console.log('确认发货:', orderId);

        // 模拟分配卡密
        const cardKey = 'MOCK-CARD-KEY-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // 显示成功消息
        alert(`确认发货成功！卡密: ${cardKey}`);

        // 重新加载待处理订单
        loadPendingOrders();
    }
}
