import React, { useEffect, useState } from "react";
import { useStore } from "../store"; // Import store
import { Link, Navigate } from "react-router-dom";
import { ShoppingBag, RefreshCw, Loader2, AlertCircle } from "lucide-react";
import OrderTracker from "../components/OrderTracker";

export default function MyOrdersPage() {
  // 1. Lấy state từ store
  const [state] = useStore();
  const { user, domain } = state;

  // 2. State nội bộ
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Fetch orders từ API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Giả sử API cần token, bạn có thể thêm header Authorization nếu cần
        // const token = localStorage.getItem('accessToken');

        const response = await fetch(`${domain}/api/orders`, {
          headers: {
            // 'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error("Không thể tải danh sách đơn hàng");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Lỗi tải đơn hàng:", err);
        setError("Có lỗi xảy ra khi tải lịch sử đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, domain]);

  // Redirect nếu chưa login
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <ShoppingBag className="text-blue-600" /> Đơn hàng của tôi
      </h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-blue-600 mr-2" /> Đang tải dữ
          liệu...
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded text-red-600 flex items-center gap-2">
          <AlertCircle size={20} /> {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">Bạn chưa có đơn hàng nào.</p>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700"
          >
            Mua sắm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border overflow-hidden"
            >
              {/* Header Đơn hàng */}
              <div className="bg-gray-50 p-4 border-b flex flex-wrap justify-between items-center gap-4">
                <div>
                  <span className="font-bold text-gray-700">
                    Đơn hàng #{order.id}
                  </span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-sm text-gray-500">
                    Ngày đặt:{" "}
                    {new Date(
                      order.created_at || order.date
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <div className="text-blue-600 font-bold text-lg">
                  {order.final_amount?.toLocaleString() ||
                    order.total?.toLocaleString()}
                  đ
                </div>
              </div>

              {/* Phần nội dung & Tracker */}
              <div className="p-6">
                <div className="mb-8 px-4 md:px-12">
                  <OrderTracker status={order.status} />
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Danh sách sản phẩm (API trả về mảng items trong order) */}
                  <div className="flex-1 space-y-3">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <img
                            src={item.image_url || item.image}
                            alt=""
                            className="w-16 h-16 object-contain border rounded bg-gray-50 mix-blend-multiply"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {item.name || item.product_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              x{item.quantity}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        Chi tiết sản phẩm đang cập nhật...
                      </p>
                    )}
                  </div>

                  {/* Hành động */}
                  <div className="flex flex-col gap-2 w-full md:w-auto min-w-[200px]">
                    <Link
                      to={`/order/${order.id}`}
                      className="w-full text-center border border-blue-600 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50"
                    >
                      Xem chi tiết
                    </Link>
                    {order.status === "PENDING" && (
                      <Link
                        to={`/order/${order.id}`}
                        className="w-full text-center bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={16} /> Thanh toán lại
                      </Link>
                    )}
                    {order.status === "COMPLETED" && (
                      <button className="w-full text-center bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-gray-700">
                        Mua lại
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
