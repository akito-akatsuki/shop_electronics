const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const queryDatabase = require("@mySQLConfig");
const { toBase64URL } = require("@suid");
const getVNDate = require("@dateVN");

// Import fetch động (Hỗ trợ Node.js cũ và mới)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const router = express.Router();
router.use(cookieParser());

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- HELPER: Tạo JWT ---
const createTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role || "user" },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
};

// --- ROUTE: Login Google ---
router.post("/google", async (req, res) => {
  // Lấy credential và làm sạch (trim) để tránh lỗi khoảng trắng
  const rawCredential = req.body.credential;
  const credential = rawCredential ? rawCredential.trim() : null;

  if (!credential) {
    return res.status(400).json({ error: "Không tìm thấy token" });
  }

  try {
    let payload;

    // [QUAN TRỌNG] Kiểm tra loại Token
    // Access Token bắt đầu bằng "ya29."
    if (credential.startsWith("ya29.")) {
      console.log("🔹 Đang xử lý Access Token...");

      // Gọi Google UserInfo API
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${credential}` },
        }
      );

      if (!response.ok) {
        throw new Error("Access Token không hợp lệ hoặc đã hết hạn.");
      }

      const data = await response.json();

      // Chuẩn hóa dữ liệu
      payload = {
        email: data.email,
        name: data.name,
        picture: data.picture,
        sub: data.sub,
        given_name: data.given_name,
        family_name: data.family_name,
        email_verified: data.email_verified,
      };
    } else {
      console.log("🔹 Đang xử lý ID Token (JWT)...");
      // Xử lý ID Token (nếu dùng GoogleLogin button component)
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    }

    // --- XỬ LÝ DỮ LIỆU DB (Logic giữ nguyên) ---
    const {
      email,
      name,
      picture,
      sub,
      given_name,
      family_name,
      email_verified,
    } = payload;
    const userId = toBase64URL(sub);
    const now = getVNDate();

    const sql = `
      INSERT INTO users
        (id, email, name, given_name, family_name, picture, email_verified, created_at, updated_at, login_count, role, status)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'user', 'active')
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        given_name = VALUES(given_name),
        family_name = VALUES(family_name),
        picture = VALUES(picture),
        email_verified = VALUES(email_verified),
        updated_at = VALUES(updated_at),
        login_count = login_count + 1;
    `;

    await queryDatabase(sql, [
      userId,
      email,
      name,
      given_name,
      family_name,
      picture,
      email_verified ? 1 : 0,
      now,
      now,
    ]);

    const [currentUser] = await queryDatabase(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );

    if (currentUser.status === "locked") {
      return res.status(403).json({ error: "Tài khoản đã bị khóa" });
    }

    const { accessToken, refreshToken } = createTokens(currentUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, user: currentUser });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(401).json({ error: "Xác thực thất bại: " + err.message });
  }
});

// ... Các route khác (Refresh, Me, Logout) giữ nguyên như cũ ...
router.post("/refresh", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ error: "Vui lòng đăng nhập lại" });

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Refresh token hết hạn" });

    try {
      const [user] = await queryDatabase(
        "SELECT id, email, role, status FROM users WHERE id = ?",
        [decoded.id]
      );
      if (!user || user.status === "locked")
        return res.status(403).json({ error: "User bị khóa" });

      const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    } catch (dbError) {
      res.status(500).json({ error: "Lỗi server" });
    }
  });
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const [user] = await queryDatabase("SELECT * FROM users WHERE id = ?", [
      req.user.id,
    ]);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Đã đăng xuất" });
});

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Thiếu token" });
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token không hợp lệ" });
    req.user = decoded;
    next();
  });
}

function authorizeAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin")
    return res.status(403).json({ error: "Admin only" });
  next();
}

module.exports = router;
module.exports.authenticate = authenticate;
module.exports.authorizeAdmin = authorizeAdmin;
