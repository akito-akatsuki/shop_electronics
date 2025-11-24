import React, { useState, useEffect, useMemo } from "react";
import { Filter, Search, Loader2, AlertCircle } from "lucide-react";
import { useStore } from "../store"; // Import store
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/mockData"; // Dùng danh sách danh mục tĩnh

export default function ProductsPage() {
  // 1. Lấy domain từ store
  const [state] = useStore();
  const { domain } = state;

  // 2. State dữ liệu và UI
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State bộ lọc
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest"); // newest, price-asc, price-desc
  const [tempPrice, setTempPrice] = useState({ min: "", max: "" }); // Giá trị trong input
  const [appliedPrice, setAppliedPrice] = useState({ min: "", max: "" }); // Giá trị đã áp dụng để gọi API

  // 3. Gọi API khi bộ lọc thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Xây dựng query string
        const params = new URLSearchParams();
        if (selectedCategory !== "all")
          params.append("category", selectedCategory);
        if (sortOrder) params.append("sort", sortOrder);
        if (appliedPrice.min) params.append("minPrice", appliedPrice.min);
        if (appliedPrice.max) params.append("maxPrice", appliedPrice.max);

        // Gọi API backend
        const response = await fetch(
          `${domain}/api/products?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Không thể tải danh sách sản phẩm");
        }

        const data = await response.json();

        // Xử lý trường hợp API trả về {data: []} hoặc []
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.data && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Lỗi tải sản phẩm:", err);
        setError("Đã có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    if (domain) {
      fetchProducts();
    }
  }, [domain, selectedCategory, sortOrder, appliedPrice]);

  // Xử lý sự kiện áp dụng giá
  const handleApplyPrice = () => {
    setAppliedPrice(tempPrice);
  };

  // Xử lý xóa bộ lọc
  const handleClearFilters = () => {
    setSelectedCategory("all");
    setSortOrder("newest");
    setTempPrice({ min: "", max: "" });
    setAppliedPrice({ min: "", max: "" });
  };

  return (
    <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-8">
      {/* --- SIDEBAR FILTERS (Cột trái) --- */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-24">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2">
            <Filter size={20} /> Bộ lọc tìm kiếm
          </h3>

          {/* Danh mục */}
          <div className="mb-6">
            <p className="font-bold text-sm text-gray-800 mb-3">
              Danh mục sản phẩm
            </p>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-blue-600 text-white font-medium shadow-md"
                      : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Khoảng giá */}
          <div className="pt-4 border-t border-gray-100">
            <p className="font-bold text-sm text-gray-800 mb-3">Khoảng giá</p>
            <div className="flex gap-2 items-center mb-3">
              <input
                type="number"
                placeholder="Từ"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                value={tempPrice.min}
                onChange={(e) =>
                  setTempPrice({ ...tempPrice, min: e.target.value })
                }
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Đến"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                value={tempPrice.max}
                onChange={(e) =>
                  setTempPrice({ ...tempPrice, max: e.target.value })
                }
              />
            </div>
            <button
              onClick={handleApplyPrice}
              className="w-full bg-white border border-blue-600 text-blue-600 py-1.5 rounded text-sm font-bold hover:bg-blue-50 transition"
            >
              Áp dụng
            </button>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT (Danh sách sản phẩm) --- */}
      <div className="flex-1">
        {/* Header của danh sách */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 bg-white p-4 rounded-lg border shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {selectedCategory === "all" ? "Tất cả sản phẩm" : "Kết quả lọc"}
            </h2>
            <span className="text-sm text-gray-500">
              Hiển thị {products.length} kết quả
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">
              Sắp xếp theo:
            </span>
            <select
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 bg-white cursor-pointer"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        {/* Hiển thị Loading / Error / Empty / Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600 mr-2" size={32} />
            <span className="text-gray-500">Đang tải danh sách...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12 text-red-500 bg-red-50 rounded-lg border border-red-100">
            <AlertCircle className="mr-2" /> {error}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-dashed">
            <Search size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">
              Không tìm thấy sản phẩm nào phù hợp.
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 text-blue-600 font-medium hover:underline"
            >
              Xóa bộ lọc & Xem tất cả
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
