// routes/products.js
const express = require("express");
const router = express.Router();
const queryDatabase = require("@mySQLConfig");

// GET /api/products - Lấy danh sách (Có lọc & Tìm kiếm & Sắp xếp)
router.get("/", async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;

    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    // 1. Filter by Category
    if (category && category !== "all") {
      // Cần join bảng categories nếu filter theo slug, ở đây giả sử filter theo category_id hoặc slug
      // Để đơn giản, giả sử frontend gửi category_id hoặc ta subquery
      sql += " AND category_id = (SELECT id FROM categories WHERE slug = ?)";
      params.push(category);
    }

    // 2. Search by Name
    if (search) {
      sql += " AND name LIKE ?";
      params.push(`%${search}%`);
    }

    // 3. Filter by Price
    if (minPrice) {
      sql += " AND price >= ?";
      params.push(minPrice);
    }
    if (maxPrice) {
      sql += " AND price <= ?";
      params.push(maxPrice);
    }

    // 4. Sorting
    if (sort === "price-asc") {
      sql += " ORDER BY price ASC";
    } else if (sort === "price-desc") {
      sql += " ORDER BY price DESC";
    } else {
      sql += " ORDER BY created_at DESC"; // Mặc định mới nhất
    }

    const products = await queryDatabase(sql, params);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi lấy danh sách sản phẩm" });
  }
});

// GET /api/products/:id - Chi tiết sản phẩm + Reviews
router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;

    // Lấy thông tin sản phẩm
    const [product] = await queryDatabase(
      `SELECT p.*, c.name as category_name
       FROM products p
       JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [productId]
    );

    if (!product)
      return res.status(404).json({ error: "Không tìm thấy sản phẩm" });

    // Lấy reviews
    const reviews = await queryDatabase(
      `SELECT r.*, u.name as user_name, u.picture
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [productId]
    );

    // Tính điểm trung bình rating thực tế (nếu muốn realtime thay vì cột rating tĩnh)
    // product.rating = reviews.reduce(...) / reviews.length

    res.json({ ...product, reviews });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

// GET /api/categories - Lấy danh mục cho Sidebar
router.get("/categories/all", async (req, res) => {
  try {
    const categories = await queryDatabase("SELECT * FROM categories");
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy danh mục" });
  }
});

module.exports = router;
