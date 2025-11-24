import React, { useState, useMemo } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { MapPin, Phone, User, QrCode, Loader2 } from "lucide-react";
import { useStore, actions } from "../store"; // Import actions để xóa giỏ hàng sau khi đặt
import { LOYALTY_LEVELS } from "../data/mockData";

export default function CheckoutPage() {
  const navigate = useNavigate();
  // 1. Sử dụng store
  const [state, dispatch] = useStore();
  const { cart = [], user, domain } = state;

  const [loading, setLoading] = useState(false);

  // 2. Logic tính toán tổng tiền (Cần tính lại ở đây vì không còn dùng Context cũ)
  const cartTotals = useMemo(() => {
    let subtotal = 0;
    let bulkDiscount = 0;

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

  // 3. State form
  const [formData, setFormData] = useState({
    name: user ? user.name : "",
    phone: "",
    address: "",
    note: "",
  });

  // Redirect nếu giỏ hàng trống
  if (!cart || cart.length === 0) {
    return <Navigate to="/products" />;
  }

  // 4. Xử lý đặt hàng gọi API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      // Chuẩn bị dữ liệu gửi lên Server
      const orderPayload = {
        items: cart,
        shippingInfo: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          note: formData.note,
        },
        total: cartTotals.finalTotal,
        paymentMethod: "VIETQR", // Mặc định cho flow này
      };

      // Gọi API tạo đơn hàng
      const response = await fetch(`${domain}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Nếu API cần token xác thực, bạn có thể thêm Authorization header ở đây
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        throw new Error(`Lỗi server: ${response.status}`);
      }

      const data = await response.json();

      // Thành công:
      // 1. Xóa giỏ hàng trong store
      dispatch(actions.clearCart());

      // 2. Chuyển hướng sang trang chi tiết đơn hàng (kèm mã QR)
      // Giả sử API trả về { success: true, orderId: 123, ... }
      navigate(`/order/${data.orderId}`);
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      alert("Đặt hàng thất bại. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Xác nhận thanh toán
      </h2>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Cột Trái: Thông tin giao hàng */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MapPin className="text-blue-600" size={20} /> Thông tin giao hàng
          </h3>

          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ và tên
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-2.5 text-gray-400"
                />
                <input
                  type="tel"
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="09xx xxx xxx"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ nhận hàng
              </label>
              <textarea
                required
                rows="3"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Số nhà, đường, phường/xã, quận/huyện..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú (tùy chọn)
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded-lg outline-none"
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
              />
            </div>
          </form>
        </div>

        {/* Cột Phải: Tóm tắt đơn hàng */}
        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
          <h3 className="font-bold text-lg mb-4">Đơn hàng của bạn</h3>
          <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 text-sm">
                <div className="w-12 h-12 bg-gray-50 border rounded flex-shrink-0 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt=""
                    className="h-10 w-10 object-contain mix-blend-multiply"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium line-clamp-1">{item.name}</p>
                  <p className="text-gray-500">x{item.quantity}</p>
                </div>
                <div className="font-bold text-gray-700">
                  {(item.price * item.quantity).toLocaleString()}đ
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{cartTotals.subtotal.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-blue-700 pt-2 border-t">
              <span>Tổng thanh toán</span>
              <span>{cartTotals.finalTotal.toLocaleString()}đ</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading}
            className={`w-full mt-6 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2 shadow-lg ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <QrCode size={20} />
            )}
            {loading ? "ĐANG XỬ LÝ..." : "THANH TOÁN QR VIETQR"}
          </button>
        </div>
      </div>
    </div>
  );
}
