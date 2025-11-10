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
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
