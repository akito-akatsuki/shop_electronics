import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../store";
import {
  CheckCircle,
  RefreshCw,
  Home,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [state] = useStore();
  const { domain } = state;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tìm đơn hàng qua API
  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        // Gọi API lấy chi tiết đơn hàng
        const response = await fetch(`${domain}/api/orders/${id}`);

        if (!response.ok) {
          throw new Error("Không tìm thấy đơn hàng");
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error("Lỗi tải đơn hàng:", err);
        setError("Không tìm thấy đơn hàng hoặc lỗi kết nối.");
      } finally {
        setLoading(false);
      }
    };

    if (domain && id) fetchOrderDetail();
  }, [id, domain]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-green-600 mr-2" /> Đang xử lý đơn
        hàng...
      </div>
    );

  if (error || !order) {
    return (
      <div className="text-center py-20">
        <AlertCircle
          size={48}
          className="mx-auto mb-2 text-red-500 opacity-50"
        />
        <h2 className="text-xl font-bold text-gray-700">
          {error || "Không tìm thấy đơn hàng"}
        </h2>
        <Link to="/" className="text-blue-600 hover:underline mt-2 block">
          Về trang chủ
        </Link>
      </div>
    );
  }

  // Cấu hình VietQR
  const BANK_ID = "MB";
  const ACCOUNT_NO = "0987654321"; // Số tài khoản demo
  const ACCOUNT_NAME = "DO DIEN TU STORE";

  // Dùng final_amount hoặc total_amount tùy DB trả về
  const AMOUNT = order.final_amount || order.total_amount;
  const DESCRIPTION = `THANHTOAN DH${order.id}`;

  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact.png?amount=${AMOUNT}&addInfo=${DESCRIPTION}&accountName=${ACCOUNT_NAME}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-green-600 text-white p-6 text-center">
          <CheckCircle size={48} className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold">Đặt hàng thành công!</h1>
          <p>
            Mã đơn hàng:{" "}
            <span className="font-mono font-bold">#{order.id}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2">
          {/* Cột Trái: Thông tin đơn hàng */}
          <div className="p-8 border-r">
            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Thông tin nhận hàng
            </h3>
            {/* Lưu ý: API hiện tại chưa trả về shippingInfo trong bảng orders gốc.
                Nếu bạn chưa update DB để lưu shippingInfo, phần này có thể bị trống.
                Tôi sẽ hiển thị fallback nếu không có dữ liệu.
            */}
            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <p>
                <span className="font-medium">Người nhận:</span>{" "}
                {order.shipping_name || order.user_name || "Khách hàng"}
              </p>
              <p>
                <span className="font-medium">Số điện thoại:</span>{" "}
                {order.shipping_phone || order.user_phone || "---"}
              </p>
              <p>
                <span className="font-medium">Địa chỉ:</span>{" "}
                {order.shipping_address || "---"}
              </p>
            </div>

            <h3 className="font-bold text-lg mb-4 text-gray-800">
              Chi tiết sản phẩm
            </h3>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {order.items &&
                order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.name || item.product_name}{" "}
                      <span className="text-gray-500">x{item.quantity}</span>
                    </span>
                    <span className="font-medium">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </span>
                  </div>
                ))}
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg text-blue-700">
              <span>Tổng tiền:</span>
              <span>{AMOUNT?.toLocaleString()}đ</span>
            </div>

            <div className="mt-8 flex gap-3">
              <Link
                to="/"
                className="flex-1 border border-gray-300 py-2 rounded text-center hover:bg-gray-50 flex items-center justify-center gap-2"
              >
                <Home size={16} /> Trang chủ
              </Link>
              <Link
                to="/products"
                className="flex-1 bg-gray-800 text-white py-2 rounded text-center hover:bg-gray-700"
              >
                Mua thêm
              </Link>
            </div>
          </div>

          {/* Cột Phải: Mã QR Thanh toán */}
          <div className="p-8 bg-blue-50 flex flex-col items-center justify-center text-center">
            <h3 className="font-bold text-xl text-blue-800 mb-2">
              Quét mã để thanh toán
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Sử dụng App Ngân hàng hoặc Momo/ZaloPay
            </p>

            <div className="bg-white p-2 rounded-lg shadow-sm border mb-4">
              <img
                src={qrUrl}
                alt="Mã QR VietQR"
                className="w-64 h-64 object-contain"
              />
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-6">
              <p>
                Chủ tài khoản:{" "}
                <span className="font-bold uppercase">{ACCOUNT_NAME}</span>
              </p>
              <p>
                Số tài khoản:{" "}
                <span className="font-bold font-mono">
                  {ACCOUNT_NO} ({BANK_ID})
                </span>
              </p>
              <p>
                Nội dung:{" "}
                <span className="font-bold font-mono text-red-600">
                  {DESCRIPTION}
                </span>
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
            >
              <RefreshCw size={14} /> Mã QR không hiện? Nhấn để tải lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
