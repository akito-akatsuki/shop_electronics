// routes/admin.js
const express = require("express");
const router = express.Router();
const queryDatabase = require("@mySQLConfig");
const { authenticate, authorizeAdmin } = require("@auth");

// Middleware chung cho tất cả route admin
router.use(authenticate, authorizeAdmin);

// GET /api/admin/dashboard - Thống kê Dashboard
router.get("/dashboard", async (req, res) => {
  try {
    // Thống kê đơn giản
    const [income] = await queryDatabase(
      "SELECT SUM(final_amount) as total FROM orders WHERE status = 'COMPLETED'"
    );
    const [newOrders] = await queryDatabase(
      "SELECT COUNT(*) as count FROM orders WHERE status = 'PENDING'"
    );
    const [lowStock] = await queryDatabase(
      "SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10"
    );
    const [customers] = await queryDatabase(
      "SELECT COUNT(*) as count FROM users WHERE role = 'user'"
    );

    res.json({
      income: income.total || 0,
      newOrders: newOrders.count,
      lowStock: lowStock.count,
      customers: customers.count,
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy thống kê" });
  }
});

// GET /api/admin/orders - Quản lý đơn hàng (Có lọc status)
router.get("/orders", async (req, res) => {
  const { status, search } = req.query;
  let sql = `
    SELECT o.*, u.name as customer_name, u.email as customer_email
    FROM orders o
    JOIN users u ON o.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (status && status !== "ALL") {
    sql += " AND o.status = ?";
    params.push(status);
  }

  if (search) {
    sql += " AND (o.id LIKE ? OR u.name LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY o.created_at DESC";

  try {
    const orders = await queryDatabase(sql, params);

    // Lấy items cho mỗi đơn (để hiển thị modal chi tiết)
    // Code tương tự phần user get orders...

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy danh sách đơn hàng" });
  }
});

// PUT /api/admin/orders/:id/status - Cập nhật trạng thái đơn
router.put("/orders/:id/status", async (req, res) => {
  const { status } = req.body; // PENDING, SHIPPING, COMPLETED, CANCELLED
  try {
    await queryDatabase("UPDATE orders SET status = ? WHERE id = ?", [
      status,
      req.params.id,
    ]);
    res.json({ success: true, message: "Cập nhật trạng thái thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi cập nhật" });
  }
});

// GET /api/admin/users - Quản lý khách hàng
router.get("/users", async (req, res) => {
  try {
    const users = await queryDatabase(
      "SELECT * FROM users WHERE role = 'user' ORDER BY created_at DESC"
    );
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Lỗi lấy danh sách user" });
  }
});

// PUT /api/admin/users/:id/points - Sửa điểm loyalty
router.put("/users/:id/points", async (req, res) => {
  const { points } = req.body;
  try {
    await queryDatabase("UPDATE users SET loyalty_points = ? WHERE id = ?", [
      points,
      req.params.id,
    ]);

    // Tự động update Tier dựa trên points
    let newTier = "BRONZE";
    if (points >= 10000) newTier = "DIAMOND";
    else if (points >= 5000) newTier = "GOLD";
    else if (points >= 1000) newTier = "SILVER";

    await queryDatabase("UPDATE users SET loyalty_tier = ? WHERE id = ?", [
      newTier,
      req.params.id,
    ]);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Lỗi cập nhật điểm" });
  }
});

// CRUD Sản phẩm (Thêm/Sửa/Xóa) - Tự viết thêm tương tự...

module.exports = router;
