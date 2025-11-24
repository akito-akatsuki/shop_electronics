import React from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import { useStore, actions } from "../store"; // 1. Thay đổi import: Dùng store thay vì Context cũ

export default function ProductCard({ product }) {
  // 2. Lấy dispatch từ store
  const [state, dispatch] = useStore();

  // 3. Hàm xử lý thêm vào giỏ hàng
  const handleAddToCart = (e) => {
    e.preventDefault(); // Ngăn việc bấm nút mua mà bị nhảy trang chi tiết

    // Dispatch action thêm vào giỏ
    dispatch(actions.addToCart(product));

    // (Tùy chọn) Có thể alert hoặc toast thông báo ở đây
    // alert(`Đã thêm ${product.name} vào giỏ hàng`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100 group">
      {/* Link bao quanh ảnh */}
      <Link
        to={`/product/${product.id}`}
        className="relative p-4 flex justify-center bg-gray-50 rounded-t-lg overflow-hidden block"
      >
        <img
          // Ưu tiên image_url từ API, nếu không có thì dùng image (cho mock data)
          src={product.image_url || product.image}
          alt={product.name}
          className="h-40 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
        />

        {/* Kiểm tra tồn kho an toàn */}
        {(product.stock_quantity || product.stock || 0) < 20 && (
          <span className="absolute top-2 left-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded font-medium">
            Sắp hết hàng
          </span>
        )}
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-gray-500 mb-1 uppercase font-semibold">
          {product.brand || "No Brand"}
        </div>

        {/* Link bao quanh tên */}
        <Link
          to={`/product/${product.id}`}
          className="font-medium text-gray-800 mb-2 line-clamp-2 flex-1 hover:text-blue-600 transition-colors"
        >
          {product.name}
        </Link>

        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400 text-xs">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={
                  i < Math.floor(product.rating || 5) ? "currentColor" : "none"
                }
                stroke="currentColor"
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 ml-1">
            ({product.stock_quantity || product.stock || 0} sẵn có)
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-dashed border-gray-100">
          <span className="text-lg font-bold text-blue-700">
            {product.price?.toLocaleString("vi-VN")}đ
          </span>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors shadow-lg shadow-blue-100"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
