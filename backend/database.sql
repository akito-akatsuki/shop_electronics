-- 1. Bảng Users (Giữ nguyên cấu trúc gốc + Thêm cột Loyalty)
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  mention VARCHAR(100) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  given_name VARCHAR(100) DEFAULT NULL,
  family_name VARCHAR(100) DEFAULT NULL,
  picture TEXT DEFAULT NULL,
  login_count INT DEFAULT 0,
  email_verified TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL,
  -- Cột mới cho hệ thống Loyalty
  loyalty_points INT DEFAULT 0,
  loyalty_tier VARCHAR(20) DEFAULT 'BRONZE' -- BRONZE, SILVER, GOLD, DIAMOND
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- 2. Bảng Categories (Danh mục)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL
);

-- 3. Bảng Products (Sản phẩm & Kho)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    image_url TEXT,
    brand VARCHAR(100),
    rating DECIMAL(2, 1) DEFAULT 5.0, -- Thêm cột rating để khớp với UI
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 4. Bảng Orders (Đơn hàng)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255),
    total_amount DECIMAL(15, 2) NOT NULL,
    discount_amount DECIMAL(15, 2) DEFAULT 0,
    final_amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 5. Bảng Order Items (Chi tiết đơn hàng)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 6. Bảng Loyalty Logs (Lịch sử điểm thưởng)
CREATE TABLE loyalty_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255),
    points_change INT NOT NULL,
    reason VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 7. Bảng Inventory Logs (Lịch sử nhập xuất kho)
CREATE TABLE inventory_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    quantity_change INT NOT NULL,
    type VARCHAR(20),
    note VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 8. Bảng Reviews (Đánh giá sản phẩm)
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    product_id INT NOT NULL,
    rating ENUM('1','2','3','4','5') NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 9. Bảng Contact Messages (Tin nhắn liên hệ)
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(20) DEFAULT 'NEW', -- NEW, READ, REPLIED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Dữ liệu mẫu cho Reviews
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
('user_123_placeholder', 1, 5, 'Sản phẩm rất tốt, giao hàng nhanh'),
('user_123_placeholder', 1, 4, 'Dùng ổn, nhưng đóng gói hơi sơ sài');

-- --- DỮ LIỆU MẪU (SEED DATA) ---

-- 1. Insert Categories (Thêm ID cụ thể để liên kết sản phẩm chính xác)
INSERT INTO categories (id, name, slug) VALUES
(1, 'Linh kiện điện tử', 'linh-kien'),
(2, 'Mạch tích hợp (IC)', 'ic'),
(3, 'Module - Cảm biến', 'module-cam-bien'),
(4, 'Dụng cụ sửa chữa', 'dung-cu');

-- 2. Insert Products (Dữ liệu khớp với App.jsx)
INSERT INTO products (category_id, name, price, stock_quantity, image_url, brand, rating, description) VALUES
(3, 'Arduino Uno R3', 150000, 50, 'https://placehold.co/200x200/2563eb/white?text=Arduino', 'Arduino', 4.5, 'Bo mạch lập trình cơ bản thông dụng nhất'),
(3, 'Module ESP8266 NodeMCU', 85000, 120, 'https://placehold.co/200x200/2563eb/white?text=ESP8266', 'Espressif', 4.8, 'Module Wifi giá rẻ cho IoT'),
(4, 'Mỏ hàn điều chỉnh nhiệt 60W', 120000, 30, 'https://placehold.co/200x200/dc2626/white?text=Solder', 'NoBrand', 4.2, 'Mỏ hàn chì chuyên dụng sửa chữa điện tử'),
(2, 'IC NE555 Timer', 5000, 1000, 'https://placehold.co/200x200/4b5563/white?text=NE555', 'TI', 5.0, 'IC tạo xung huyền thoại'),
(3, 'Cảm biến siêu âm HC-SR04', 25000, 80, 'https://placehold.co/200x200/2563eb/white?text=HC-SR04', 'Generic', 4.0, 'Cảm biến đo khoảng cách bằng sóng siêu âm'),
(4, 'Đồng hồ vạn năng DT9205A', 180000, 15, 'https://placehold.co/200x200/dc2626/white?text=Multimeter', 'Best', 4.6, 'Đồng hồ đo điện đa năng màn hình LCD');