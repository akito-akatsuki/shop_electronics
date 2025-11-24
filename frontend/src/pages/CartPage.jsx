import React, { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useStore, actions } from "../store"; // Import actions từ store
import { LOYALTY_LEVELS } from "../data/mockData";

export default function CartPage() {
  const navigate = useNavigate();
  // 1. Lấy state và dispatch
  const [state, dispatch] = useStore();
  const { cart = [], user } = state; // Gán mặc định [] để tránh lỗi undefined

  // 2. Logic tính toán tổng tiền
  const cartTotals = useMemo(() => {
    let subtotal = 0;
    let bulkDiscount = 0;

    // Kiểm tra an toàn trước khi loop
    if (Array.isArray(cart)) {
      cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        if (item.quantity >= 5) {
          bulkDiscount += itemTotal * 0.05;
        }
      });
    }

    const loyaltyDiscountRate = user
      ? LOYALTY_LEVELS[user.loyalty_tier]?.discount || 0
      : 0;
    const loyaltyDiscount = (subtotal - bulkDiscount) * loyaltyDiscountRate;

    const finalTotal = subtotal - bulkDiscount - loyaltyDiscount;

    return { subtotal, bulkDiscount, loyaltyDiscount, finalTotal };
  }, [cart, user]);

  // 3. Xử lý sự kiện dùng actions chuẩn
  const handleUpdateQuantity = (id, delta) => {
    dispatch(actions.updateCartQuantity(id, delta));
  };

  const handleRemove = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      dispatch(actions.removeFromCart(id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart /> Giỏ hàng của bạn
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500 mb-4">Giỏ hàng đang trống</p>
          <Link to="/products" className="text-blue-600 hover:underline">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Danh sách sản phẩm */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg shadow-sm border flex items-center gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain border rounded bg-gray-50"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.price?.toLocaleString()}đ
                  </p>
                  {item.quantity >= 5 && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                      Đủ điều kiện giảm giá sỉ (5%)
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200 font-bold flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="w-8 h-8 bg-gray-100 rounded hover:bg-gray-200 font-bold flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <div className="text-right min-w-[100px]">
                  <p className="font-bold text-blue-700">
                    {(item.price * item.quantity).toLocaleString()}đ
                  </p>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tổng đơn hàng */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-24">
              <h3 className="font-bold text-lg mb-4">Tổng đơn hàng</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{cartTotals.subtotal.toLocaleString()}đ</span>
                </div>
                {cartTotals.bulkDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá số lượng:</span>
                    <span>-{cartTotals.bulkDiscount.toLocaleString()}đ</span>
                  </div>
                )}
                {user && (
                  <div className="flex justify-between text-blue-600">
                    <span>
                      Thành viên{" "}
                      {LOYALTY_LEVELS[user.loyalty_tier]?.label || "Mới"}:
                    </span>
                    <span>-{cartTotals.loyaltyDiscount.toLocaleString()}đ</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-800 mb-6">
                <span>Tổng cộng:</span>
                <span>{cartTotals.finalTotal.toLocaleString()}đ</span>
              </div>

              {!user && (
                <div className="mb-4 text-xs bg-yellow-50 p-2 text-yellow-800 rounded border border-yellow-200">
                  <Link to="/login" className="font-bold underline">
                    Đăng nhập
                  </Link>{" "}
                  để tích điểm và nhận ưu đãi thành viên!
                </div>
              )}

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition shadow-lg"
              >
                TIẾN HÀNH ĐẶT HÀNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
