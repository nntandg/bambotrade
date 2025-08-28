-- 用户表
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 商品表
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 卡密表
CREATE TABLE cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  card_key VARCHAR(255) NOT NULL,
  is_sold BOOLEAN DEFAULT FALSE,
  order_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- 订单表
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_id INT NOT NULL,
  card_id INT,
  amount DECIMAL(10, 2) NOT NULL,
  status ENUM('PENDING_PAYMENT', 'PAID', 'CONFIRMED_PAYMENT', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING_PAYMENT',
  payment_method VARCHAR(50) NOT NULL,
  note TEXT,
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (card_id) REFERENCES cards(id)
);

-- 管理员日志表
CREATE TABLE admin_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_id INT,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- 设置表
CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入默认管理员
INSERT INTO users (username, password, role) VALUES ('admin', '$2b$10$YourHashedPassword', 'ADMIN');

-- 插入示例商品
INSERT INTO products (name, description, price, stock, category) VALUES
('Netflix 1个月会员', '全球最受欢迎的流媒体服务', 25.00, 100, '视频会员'),
('Spotify 1个月会员', '全球领先的音乐流媒体服务', 15.00, 200, '音乐会员'),
('Adobe Creative Cloud 1个月', '专业创意设计软件套装', 80.00, 50, '设计软件');