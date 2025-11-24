// routes/contact.js
const express = require("express");
const router = express.Router();
const queryDatabase = require("@mySQLConfig");

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await queryDatabase(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, message]
    );
    res.json({ success: true, message: "Đã gửi tin nhắn thành công" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi gửi tin nhắn" });
  }
});

module.exports = router;
