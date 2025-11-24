// routes/orders.js
const express = require("express");
const router = express.Router();
const queryDatabase = require("@mySQLConfig");
const { authenticate } = require("@auth"); // Import từ file auth của bạn

// POST /api/orders - Tạo đơn hàng (Checkout)
router.post("/", authenticate, async (req, res) => {
  const { items, shippingInfo, total, paymentMethod } = req.body;
  const userId = req.user.id; // Lấy từ token

  // Lưu ý: Trong thực tế cần dùng Transaction (START TRANSACTION... COMMIT)
  // Ở đây viết code logic tuần tự để dễ hiểu với queryDatabase cơ bản

  try {
    // 1. Validate tồn kho (Optional but recommended)
    // ...

    // 2. Tạo Order
    const insertOrderSql = `
      INSERT INTO orders (user_id, total_amount, final_amount, status, created_at)
      VALUES (?, ?, ?, 'PENDING', NOW())
    `;
    const orderResult = await queryDatabase(insertOrderSql, [
      userId,
      total,
      total,
    ]);
    const orderId = orderResult.insertId;

    // 3. Lưu Shipping Info (Vì bảng orders gốc không có cột này, ta có thể lưu vào bảng riêng hoặc update bảng orders thêm cột address/phone.
    // Tạm thời giả định bạn đã thêm cột 'address' và 'phone' vào bảng orders hoặc lưu JSON vào cột ghi chú nếu lười sửa DB)
    // Hoặc tạo bảng order_details. Ở đây tôi bỏ qua bước này để khớp với DB schema bạn đưa.

    // 4. Insert Order Items & Trừ tồn kho
    for (const item of items) {
      await queryDatabase(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, item.price]
      );

      // Trừ tồn kho
      await queryDatabase(
        "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
        [item.quantity, item.id]
      );
    }

    // 5. Tính điểm Loyalty (Ví dụ: 1000đ = 1 điểm)
    const pointsEarned = Math.floor(total / 1000);

    // Cộng điểm cho User
    await queryDatabase(
      "UPDATE users SET loyalty_points = loyalty_points + ? WHERE id = ?",
      [pointsEarned, userId]
    );

    // Ghi log Loyalty
    await queryDatabase(
      "INSERT INTO loyalty_logs (user_id, points_change, reason) VALUES (?, ?, ?)",
      [userId, pointsEarned, `Thưởng đơn hàng #${orderId}`]
    );

    // Cập nhật hạng thành viên (Logic đơn giản)
    // ... (Có thể viết trigger SQL hoặc logic JS ở đây để update BRONZE -> SILVER)

    res.json({
      success: true,
      orderId: orderId,
      message: "Đặt hàng thành công",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi tạo đơn hàng" });
  }
});

// GET /api/orders - Lấy lịch sử đơn hàng của tôi
router.get("/", authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // Lấy ID từ token đã giải mã

    // Lấy danh sách đơn hàng
    const orders = await queryDatabase(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [userId]
    );

    // Lấy items cho từng đơn (Nên tối ưu bằng 1 query join hoặc group_concat nếu data lớn)
    // Ở đây dùng loop đơn giản cho dễ hiểu
    for (let order of orders) {
      const items = await queryDatabase(
        `SELECT oi.*, p.name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error("Lỗi lấy danh sách đơn hàng:", err);
    res.status(500).json({ error: "Lỗi server khi lấy đơn hàng" });
  }
});

// GET /api/orders/:id - Chi tiết đơn hàng
router.get("/:id", async (req, res) => {
  try {
    // API này có thể public hoặc private tùy logic của bạn.
    // Nếu muốn private thì thêm authenticate và check user_id
    const [order] = await queryDatabase("SELECT * FROM orders WHERE id = ?", [
      req.params.id,
    ]);

    if (!order)
      return res.status(404).json({ error: "Không tìm thấy đơn hàng" });

    const items = await queryDatabase(
      `SELECT oi.*, p.name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
      [order.id]
    );

    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

module.exports = router;
