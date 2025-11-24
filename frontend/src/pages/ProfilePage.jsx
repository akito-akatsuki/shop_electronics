import React, { useEffect, useState } from "react";
import { useStore } from "../store"; // 1. Import useStore
import LoyaltyBanner from "../components/LoyaltyBanner";
import { User, History, Loader2, AlertCircle, Package } from "lucide-react";
import { Navigate, Link } from "react-router-dom";

export default function ProfilePage() {
  // 2. Lấy user và domain từ store
  const [state] = useStore();
  const { user, domain } = state;

  // 3. State quản lý lịch sử đơn hàng
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 4. Gọi API lấy lịch sử đơn hàng
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await fetch(`${domain}/api/orders`);

        if (!response.ok) {
          throw new Error("Không thể tải lịch sử đơn hàng");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error("Lỗi tải lịch sử:", err);
        setError("Có lỗi xảy ra khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [user, domain]);

  // Redirect nếu chưa đăng nhập
  if (!user) return <Navigate to="/login" />;

  // Helper function để format ngày
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Helper function màu trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "SHIPPING":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Banner Khách hàng thân thiết (Lấy thông tin từ user trong store) */}
      <LoyaltyBanner user={user} />

      <div className="grid md:grid-cols-3 gap-6">
        {/* Cột Trái: Thông tin cá nhân */}
        <div className="bg-white p-6 rounded-lg shadow-sm border h-fit">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <User size={20} /> Thông tin cá nhân
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 mb-4">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-blue-100"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {user.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Họ tên</label>
              <span className="font-medium text-gray-900">{user.name}</span>
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Email</label>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div>
              <label className="text-gray-500 block mb-1">Ngày tham gia</label>
              <span className="font-medium text-gray-900">
                {formatDate(user.created_at)}
              </span>
            </div>
            {user.phone && (
              <div>
                <label className="text-gray-500 block mb-1">
                  Số điện thoại
                </label>
                <span className="font-medium text-gray-900">{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Cột Phải: Lịch sử đơn hàng */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <History size={20} /> Lịch sử đơn hàng
            </h3>
            <Link
              to="/my-orders"
              className="text-sm text-blue-600 hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-blue-600 mr-2" /> Đang
              tải...
            </div>
          ) : error ? (
            <div className="text-red-500 bg-red-50 p-4 rounded flex items-center gap-2">
              <AlertCircle size={18} /> {error}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
              <Package className="mx-auto mb-2 opacity-20" size={48} />
              <p>Bạn chưa có đơn hàng nào.</p>
              <Link
                to="/products"
                className="text-blue-600 font-medium mt-2 inline-block"
              >
                Mua sắm ngay
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-2">Mã đơn</th>
                    <th className="px-4 py-2">Ngày</th>
                    <th className="px-4 py-2">Tổng tiền</th>
                    <th className="px-4 py-2">Trạng thái</th>
                    <th className="px-4 py-2">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order) => (
                    <tr
                      key={order.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-blue-600">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(order.created_at || order.date)}
                      </td>
                      <td className="px-4 py-3 font-bold">
                        {(
                          order.final_amount ||
                          order.total ||
                          0
                        ).toLocaleString()}
                        đ
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/order/${order.id}`}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          Xem
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
