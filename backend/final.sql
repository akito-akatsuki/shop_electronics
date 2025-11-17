CREATE TABLE users (
  id VARCHAR(11) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  mention VARCHAR(100) DEFAULT NULL,
  name VARCHAR(255) DEFAULT NULL,
  given_name VARCHAR(100) DEFAULT NULL,
  family_name VARCHAR(100) DEFAULT NULL,
  picture TEXT DEFAULT NULL,
  login_count INT DEFAULT 0,
  email_verified TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE user_shipping_address (
  id VARCHAR(11) PRIMARY KEY,
  user_id VARCHAR(11) NOT NULL,
  recipient_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  street_address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100) DEFAULT NULL,
  zip_code VARCHAR(20) DEFAULT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Vietnam',
  is_default TINYINT(1) DEFAULT 0,
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE category (
  id VARCHAR(11) PRIMARY KEY,
  category_name VARCHAR(255),
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE products (
  id VARCHAR(11) PRIMARY KEY,
  product_name VARCHAR(255),
  description TEXT,
  category_id VARCHAR(11),
  stock INT,
  price DECIMAL(10,2),
  restock_date DATE,
  FOREIGN KEY (category_id) REFERENCES category(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE shopping_cart (
  id VARCHAR(11) PRIMARY KEY,
  product_id VARCHAR(11),
  user_id VARCHAR(11),
  quantity INT,
  create_at DATETIME DEFAULT NULL,
  update_at DATETIME DEFAULT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


CREATE TABLE orders (
  id VARCHAR(11) PRIMARY KEY,
  user_id VARCHAR(11) NOT NULL,
  shipping_address_id VARCHAR(11) NOT NULL,
  order_date DATETIME NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_fee DECIMAL(10,2) DEFAULT 0.00,
  -- Chương trình khách hàng thân thiết
  points_used INT DEFAULT 0, -- Số điểm Loyalty đã sử dụng để thanh toán
  points_earned INT DEFAULT 0, -- Số điểm Loyalty tích lũy từ đơn hàng này
  -- Trạng thái đơn hàng
  payment_method VARCHAR(50) NOT NULL,
  order_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
  created_at DATETIME DEFAULT NULL,
  updated_at DATETIME DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (shipping_address_id) REFERENCES user_shipping_address(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE order_items (
  id VARCHAR(11) PRIMARY KEY,
  order_id VARCHAR(11) NOT NULL,
  product_id VARCHAR(11) NOT NULL,
  quantity INT NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL, -- Giá sản phẩm tại thời điểm mua
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE loyalty_points (
  id VARCHAR(11) PRIMARY KEY,
  user_id VARCHAR(11) NOT NULL,
  order_id VARCHAR(11) DEFAULT NULL, -- Liên kết với đơn hàng tạo ra hoặc sử dụng điểm
  points_change INT NOT NULL, -- Số điểm thay đổi (Dương: Tích lũy, Âm: Tiêu điểm)
  current_total_points INT DEFAULT 0, -- Tổng điểm hiện tại của user sau giao dịch
  reason VARCHAR(100) NOT NULL, -- Lý do thay đổi điểm (e.g., 'Purchase', 'Redeem', 'Adjustment')
  transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

------------ trigger ------------
DELIMITER //

CREATE TRIGGER before_insert_user_shipping_address
BEFORE INSERT ON user_shipping_address
FOR EACH ROW
BEGIN
    -- Nếu địa chỉ mới được đặt là mặc định (is_default = 1)
    IF NEW.is_default = 1 THEN
        -- Đặt tất cả các địa chỉ hiện có khác của người dùng này về không mặc định (0)
        UPDATE user_shipping_address
        SET is_default = 0
        WHERE user_id = NEW.user_id;
    END IF;
END;
//

DELIMITER ;

DELIMITER //

CREATE TRIGGER before_update_user_shipping_address
BEFORE UPDATE ON user_shipping_address
FOR EACH ROW
BEGIN
    -- Chỉ thực hiện nếu trạng thái is_default thay đổi thành 1
    IF NEW.is_default = 1 AND OLD.is_default = 0 THEN
        -- Đặt tất cả các địa chỉ khác của người dùng này về không mặc định (0)
        UPDATE user_shipping_address
        SET is_default = 0
        WHERE user_id = NEW.user_id
        AND id != NEW.id; -- Trừ bản ghi hiện tại đang được cập nhật
    END IF;

    -- Ngăn người dùng set tất cả địa chỉ về 0 nếu đây là địa chỉ mặc định duy nhất
    -- (Tùy chọn: Đây là một logic nghiệp vụ bổ sung)

    IF NEW.is_default = 0 AND OLD.is_default = 1 THEN
        SELECT COUNT(*) INTO @default_count
        FROM user_shipping_address
        WHERE user_id = NEW.user_id AND is_default = 1 AND id != NEW.id;

        -- Nếu không còn địa chỉ mặc định nào khác, không cho phép hủy đặt mặc định
        IF @default_count = 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Cần ít nhất một địa chỉ mặc định.';
        END IF;
    END IF;

END;
//

DELIMITER ;