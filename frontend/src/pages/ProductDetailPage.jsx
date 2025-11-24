import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore, actions } from "../store"; // 1. Import useStore & actions
import {
  Star,
  ShoppingCart,
  Truck,
  Shield,
  Check,
  Minus,
  Plus,
  ChevronRight,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  // 2. Lấy store
  const [state, dispatch] = useStore();
  const { domain } = state;

  // 3. State nội bộ
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("desc"); // desc | reviews

  // 4. Fetch API chi tiết sản phẩm
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        // Gọi API backend
        const response = await fetch(`${domain}/api/products/${id}`);

        if (!response.ok) {
          throw new Error("Không thể tải thông tin sản phẩm");
        }

        const data = await response.json();
        setProduct(data);
        setQuantity(1); // Reset số lượng
      } catch (err) {
        console.error("Lỗi fetch product:", err);
        setError("Không tìm thấy sản phẩm hoặc lỗi kết nối.");
      } finally {
        setLoading(false);
      }
    };

    if (domain && id) {
      fetchProductDetail();
    }
  }, [id, domain]);

  // 5. Xử lý thêm vào giỏ
  const handleAddToCart = () => {
    if (product) {
      // Nếu backend/store chưa hỗ trợ quantity trong payload add, ta lặp dispatch
      // (Hoặc tốt nhất update store để nhận quantity)
      for (let i = 0; i < quantity; i++) {
        dispatch(actions.addToCart(product));
      }
      alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 mr-2" /> Đang tải chi
        tiết sản phẩm...
      </div>
    );

  if (error || !product)
    return (
      <div className="text-center py-20 text-red-500">
        <AlertCircle size={48} className="mx-auto mb-2 opacity-50" />
        <p>{error || "Sản phẩm không tồn tại"}</p>
        <Link
          to="/products"
          className="text-blue-600 hover:underline mt-2 block"
        >
          Quay lại danh sách
        </Link>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600">
          Trang chủ
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <Link to="/products" className="hover:text-blue-600">
          Sản phẩm
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-gray-800 font-medium truncate">
          {product.name}
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Cột Trái: Hình ảnh */}
          <div className="flex flex-col items-center">
            <div className="w-full h-80 md:h-96 bg-gray-50 rounded-lg flex items-center justify-center border mb-4 overflow-hidden relative">
              <img
                src={product.image_url || product.image} // Ưu tiên key từ API thực
                alt={product.name}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
              />
            </div>
            {/* Thumbnails (Nếu API có trả về mảng ảnh phụ thì map ở đây) */}
            {/* <div className="flex gap-2 justify-center">...</div> */}
          </div>

          {/* Cột Phải: Thông tin chi tiết */}
          <div>
            <div className="mb-4">
              <span className="text-blue-600 font-bold uppercase text-xs tracking-wider bg-blue-50 px-2 py-1 rounded">
                {product.brand || "No Brand"}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-2">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-2 text-sm mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={
                        i < Math.floor(product.rating || 5)
                          ? "currentColor"
                          : "none"
                      }
                      stroke="currentColor"
                    />
                  ))}
                </div>
                <span className="text-gray-500">
                  ({product.reviews ? product.reviews.length : 0} đánh giá)
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-green-600 font-medium flex items-center gap-1">
                  <Check size={14} /> Còn hàng:{" "}
                  {product.stock_quantity ?? product.stock ?? 0}
                </span>
              </div>
            </div>

            {/* Giá */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-3xl font-bold text-blue-700">
                {product.price?.toLocaleString()}đ
              </p>
              {quantity >= 5 && (
                <p className="text-sm text-green-600 mt-1">
                  Mua từ 5 cái giảm thêm 5%
                </p>
              )}
            </div>

            {/* Mô tả ngắn */}
            <p className="text-gray-600 mb-6 line-clamp-3">
              {product.description ||
                "Sản phẩm chất lượng cao, nhập khẩu chính hãng. Bảo hành 1 đổi 1 trong vòng 30 ngày lỗi nhà sản xuất."}
            </p>

            {/* Chọn số lượng */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium text-gray-700">Số lượng:</span>
              <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  className="w-12 text-center border-none outline-none font-bold text-gray-800"
                  value={quantity}
                  readOnly
                />
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(
                        product.stock_quantity || product.stock || 999,
                        q + 1
                      )
                    )
                  }
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
              >
                <ShoppingCart size={20} /> Thêm vào giỏ hàng
              </button>
              <button className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg font-bold hover:bg-blue-50 transition">
                Mua ngay
              </button>
            </div>

            {/* Chính sách */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600 border p-2 rounded bg-gray-50">
                <Truck size={18} className="text-blue-500" /> Giao hàng toàn
                quốc
              </div>
              <div className="flex items-center gap-2 text-gray-600 border p-2 rounded bg-gray-50">
                <Shield size={18} className="text-green-500" /> Bảo hành chính
                hãng
              </div>
            </div>
          </div>
        </div>

        {/* --- PHẦN TABS: MÔ TẢ & ĐÁNH GIÁ --- */}
        <div className="border-t">
          <div className="flex border-b bg-gray-50">
            <button
              onClick={() => setActiveTab("desc")}
              className={`px-6 py-3 font-bold text-sm ${
                activeTab === "desc"
                  ? "border-t-2 border-blue-600 bg-white text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Mô tả sản phẩm
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 font-bold text-sm ${
                activeTab === "reviews"
                  ? "border-t-2 border-blue-600 bg-white text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Đánh giá ({product.reviews ? product.reviews.length : 0})
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "desc" ? (
              <div className="prose max-w-none text-gray-700">
                <p className="mb-4 text-lg font-medium">
                  {product.description}
                </p>
                <p className="italic text-gray-500">
                  Lưu ý: Hình ảnh sản phẩm chỉ mang tính chất minh họa, sản phẩm
                  thực tế có thể khác biệt đôi chút về màu sắc do lô hàng.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {!product.reviews || product.reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Chưa có đánh giá nào cho sản phẩm này.
                  </p>
                ) : (
                  product.reviews.map((review, idx) => (
                    <div key={idx} className="border-b pb-6 last:border-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                          {review.picture ? (
                            <img
                              src={review.picture}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User size={16} />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-sm">
                            {review.user_name || "Người dùng ẩn danh"}
                          </p>
                          <div className="flex text-yellow-400 text-xs">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                fill={
                                  i < review.rating ? "currentColor" : "none"
                                }
                                stroke="currentColor"
                              />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
