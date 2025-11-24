import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  MessageSquare,
  Send,
  Loader2,
} from "lucide-react";
import { useStore } from "../store"; // 1. Import useStore

export default function ContactPage() {
  // 2. Lấy domain từ store
  const [state] = useStore();
  const { domain } = state;

  // 3. State quản lý form và loading
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Tư vấn sản phẩm", // Giá trị mặc định của select
    message: "",
  });

  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 4. Xử lý gửi form gọi API
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(`${domain}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Lỗi server: ${response.status}`);
      }

      const data = await response.json();

      // Thành công
      alert(
        data.message ||
          "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể."
      );

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "Tư vấn sản phẩm",
        message: "",
      });
    } catch (error) {
      console.error("Lỗi gửi liên hệ:", error);
      alert("Gửi tin nhắn thất bại. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Liên hệ hỗ trợ
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin liên hệ */}
        <div className="space-y-6">
          {/* Địa chỉ */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-700">
              <MapPin size={20} /> Địa chỉ cửa hàng
            </h3>
            <p className="text-gray-600">
              Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Có chỗ để xe ô tô miễn phí
            </p>
          </div>

          {/* Hotline chi tiết */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-700">
              <Phone size={20} /> Tổng đài hỗ trợ
            </h3>
            <div className="space-y-2">
              <p className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Mua hàng:</span>{" "}
                <span className="font-medium">0987.654.321</span>
              </p>
              <p className="flex justify-between border-b border-dashed pb-1">
                <span className="text-gray-500">Kỹ thuật:</span>{" "}
                <span className="font-medium">0988.888.999</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">Khiếu nại:</span>{" "}
                <span className="font-medium">0966.777.888</span>
              </p>
            </div>
          </div>

          {/* Thời gian làm việc */}
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-700">
              <Clock size={20} /> Thời gian làm việc
            </h3>
            <p className="flex justify-between mb-2">
              <span className="text-gray-500">Thứ 2 - Thứ 7:</span>{" "}
              <span className="font-medium">8:00 - 20:00</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-500">Chủ nhật:</span>{" "}
              <span className="font-medium">9:00 - 18:00</span>
            </p>
          </div>
        </div>

        {/* Cột phải: Form liên hệ */}
        <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border">
          <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
            <MessageSquare size={24} className="text-yellow-500" /> Gửi tin nhắn
            cho chúng tôi
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  placeholder="Nhập họ tên của bạn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  placeholder="example@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              >
                <option value="Tư vấn sản phẩm">Tư vấn sản phẩm</option>
                <option value="Hỗ trợ kỹ thuật">Hỗ trợ kỹ thuật</option>
                <option value="Báo giá sỉ / Dự án">Báo giá sỉ / Dự án</option>
                <option value="Khác">Khác</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung *
              </label>
              <textarea
                rows="5"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
                placeholder="Bạn cần hỗ trợ gì?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors text-white ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
              {loading ? "Đang gửi..." : "Gửi tin nhắn"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
