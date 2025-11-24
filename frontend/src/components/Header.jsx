import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  Zap,
  Award,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
} from "lucide-react";
import { useStore, actions } from "../store"; // 1. Import useStore và actions

export default function Header() {
  // 2. Lấy state và dispatch từ store
  const [state, dispatch] = useStore();
  const { cart = [], user } = state; // Gán mặc định [] cho cart để an toàn
  const navigate = useNavigate();

  // 3. Hàm xử lý đăng xuất
  const handleLogout = () => {
    dispatch(actions.logout()); // Gọi action logout
    navigate("/");
  };

  return (
    <header className="bg-blue-900 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <Zap className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold leading-none">ĐỒ ĐIỆN TỬ</h1>
              <span className="text-xs text-blue-300">
                Linh kiện & Giải pháp
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 mx-8 max-w-xl relative">
            <input
              type="text"
              placeholder="Tìm kiếm linh kiện, IC, module..."
              className="w-full py-2 px-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-900 bg-yellow-400 p-1 rounded-full hover:bg-yellow-300">
              <Search size={18} />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative hover:text-yellow-400 transition"
            >
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group z-50">
                <button className="flex border-0 items-center gap-2 hover:text-yellow-400 py-2 transition-colors">
                  <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center border border-blue-500 shadow-sm">
                    <span className="font-bold text-white">
                      {user.name ? user.name.charAt(0) : "U"}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium truncate max-w-[120px]">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu Wrapper */}
                {/* pt-2: Tạo khoảng đệm vô hình để chuột không bị trượt ra ngoài khi di chuyển xuống */}
                <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  {/* Nội dung thực tế của Menu */}
                  <div className="bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Header của Menu */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                      <p className="font-bold text-sm text-gray-900">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            user.loyalty_tier === "DIAMOND"
                              ? "bg-cyan-500"
                              : "bg-yellow-500"
                          }`}
                        ></span>
                        <p className="text-xs text-gray-500 capitalize font-medium">
                          {user.loyalty_tier || "Member"} Member
                        </p>
                      </div>
                    </div>

                    {/* Các mục chọn */}
                    <div className="flex flex-col p-1">
                      <Link
                        to="/profile"
                        className="px-4 py-2.5 hover:bg-blue-50 hover:text-blue-700 text-sm flex items-center gap-3 rounded-lg transition-colors text-gray-600"
                      >
                        <User size={18} /> Tài khoản
                      </Link>
                      <Link
                        to="/my-orders"
                        className="px-4 py-2.5 hover:bg-blue-50 hover:text-blue-700 text-sm flex items-center gap-3 rounded-lg transition-colors text-gray-600"
                      >
                        <ShoppingBag size={18} /> Đơn hàng của tôi
                      </Link>
                      {/* Chỉ hiện Admin nếu role là admin (Logic tùy chọn) */}
                      {(user.role === "admin" ||
                        user.email?.includes("admin")) && (
                        <Link
                          to="/admin"
                          className="px-4 py-2.5 hover:bg-blue-50 hover:text-blue-700 text-sm flex items-center gap-3 rounded-lg transition-colors text-gray-600"
                        >
                          <LayoutDashboard size={18} /> Admin Demo
                        </Link>
                      )}

                      <div className="h-px bg-gray-100 my-1 mx-2"></div>

                      <button
                        onClick={handleLogout}
                        className="px-4 py-2.5 hover:bg-red-50 hover:text-red-600 text-sm flex items-center gap-3 rounded-lg transition-colors text-gray-600 w-full text-left"
                      >
                        <LogOut size={18} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium hover:text-yellow-400 border border-white px-4 py-1.5 rounded-full hover:border-yellow-400 transition hover:bg-white/10"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-full py-1.5 px-3 rounded text-gray-800 text-sm"
          />
          <button className="bg-blue-800 p-2 rounded text-white">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-blue-800 text-sm hidden md:block border-t border-blue-700">
        <div className="container mx-auto px-4 flex gap-6 py-2">
          <Link to="/" className="hover:text-yellow-400">
            Trang chủ
          </Link>
          <Link to="/about" className="hover:text-yellow-400">
            Giới thiệu
          </Link>
          <Link to="/products" className="hover:text-yellow-400 font-medium">
            Sản phẩm
          </Link>
          <Link to="/contact" className="hover:text-yellow-400">
            Liên hệ
          </Link>
          <Link
            to="/profile"
            className="hover:text-yellow-400 ml-auto flex items-center gap-1 text-yellow-300"
          >
            <Award size={14} /> Khách hàng thân thiết
          </Link>
        </div>
      </nav>
    </header>
  );
}
