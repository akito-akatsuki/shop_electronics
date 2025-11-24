import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Award,
  Star,
  Truck,
  Shield,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useStore } from "../store"; // Import store theo yêu cầu
import ProductCard from "../components/ProductCard";

export default function HomePage() {
  // 1. Khởi tạo store
  const [state, dispatch] = useStore();

  // 2. State nội bộ để lưu dữ liệu fetch được
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. useEffect để gọi API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Gọi API lấy sản phẩm
        const response = await fetch(`${state.domain}/api/products`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Giả sử API trả về mảng sản phẩm, lấy 4 sản phẩm đầu tiên
        // Nếu API có hỗ trợ phân trang hoặc limit, bạn nên sửa thành: `${state.domain}/api/products?limit=4`
        if (Array.isArray(data)) {
          setFeaturedProducts(data.slice(0, 4));
        } else {
          // Trường hợp API trả về object dạng { data: [...] }
          setFeaturedProducts(data.data ? data.data.slice(0, 4) : []);
        }
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm nổi bật:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (state.domain) {
      fetchFeaturedProducts();
    }
  }, [state.domain]); // Chạy lại khi domain thay đổi (hoặc chỉ chạy 1 lần nếu domain cố định)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 1. HERO SECTION (Banner chính) */}
      <div className="bg-blue-800 rounded-2xl text-white p-8 md:p-12 mb-10 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            Linh kiện điện tử <br />
            chính hãng & giá tốt
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Cung cấp IC, cảm biến, module và dụng cụ sửa chữa chất lượng cao cho
            kỹ sư, sinh viên và Maker Việt Nam.
          </p>
          <div className="flex gap-4">
            <Link
              to="/products"
              className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition inline-flex items-center gap-2 shadow-lg"
            >
              Xem sản phẩm <ChevronRight size={20} />
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>

        {/* Họa tiết trang trí (Abstract Circles) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-yellow-400 opacity-20 rounded-full -mb-10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>
      </div>

      {/* 2. USP SECTION (Lợi ích khách hàng) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Truck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Giao hàng toàn quốc</h4>
            <p className="text-sm text-gray-500">Nhận hàng trong 2-3 ngày</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="p-3 bg-green-100 text-green-600 rounded-full">
            <Shield size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Bảo hành 1 đổi 1</h4>
            <p className="text-sm text-gray-500">Trong vòng 30 ngày đầu</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Hỗ trợ 24/7</h4>
            <p className="text-sm text-gray-500">Tư vấn kỹ thuật miễn phí</p>
          </div>
        </div>
      </div>

      {/* 3. FEATURED PRODUCTS (Sản phẩm nổi bật) */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Award className="text-blue-600" /> Sản phẩm nổi bật
          </h3>
          <Link
            to="/products"
            className="text-blue-600 hover:underline text-sm font-medium flex items-center"
          >
            Xem tất cả <ChevronRight size={16} />
          </Link>
        </div>

        {/* Xử lý trạng thái Loading và Error */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-blue-600 mr-2" /> Đang tải sản
            phẩm...
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-8 text-red-500 bg-red-50 rounded-lg">
            <AlertCircle className="mr-2" /> {error}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
