import React, { useState, useMemo, useEffect } from "react";
import { useStore, actions } from "../store"; // Import useStore & actions
import {
  LayoutDashboard,
  Package,
  Truck,
  Users,
  Edit,
  Trash2,
  XCircle,
  Save,
  Search,
  Eye,
  CheckCircle,
  Clock,
  DollarSign,
  Plus,
  Upload,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { LOYALTY_LEVELS } from "../data/mockData";

export default function AdminPage() {
  // 1. Lấy store
  const [state, dispatch] = useStore();
  const { domain, user } = state;

  // --- STATE QUẢN LÝ CHUNG ---
  const [adminTab, setAdminTab] = useState("dashboard"); // dashboard, orders, products, customers
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    income: 0,
    newOrders: 0,
    lowStock: 0,
    customers: 0,
  });

  // --- STATE ĐƠN HÀNG ---
  const [orders, setOrders] = useState([]);
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- STATE SẢN PHẨM ---
  const [products, setProducts] = useState([]); // Local state cho admin (có thể khác store global)
  const [productSearch, setProductSearch] = useState("");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "linh-kien",
    price: 0,
    stock: 0,
    brand: "",
    image: "",
    description: "",
  });

  // --- STATE KHÁCH HÀNG ---
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userPointsForm, setUserPointsForm] = useState(0);

  // --- FETCH DATA FUNCTIONS ---

  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(`${domain}/api/admin/dashboard`);
      if (res.ok) setStats(await res.json());
    } catch (err) {
      console.error("Lỗi tải thống kê", err);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Build query string
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (orderSearch) params.append("search", orderSearch);

      const res = await fetch(
        `${domain}/api/admin/orders?${params.toString()}`
      );
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error("Lỗi tải đơn hàng", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${domain}/api/products`); // Lấy tất cả (admin có thể cần API riêng nếu muốn xem cả sản phẩm ẩn)
      if (res.ok) setProducts(await res.json());
    } catch (err) {
      console.error("Lỗi tải sản phẩm", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${domain}/api/admin/users`);
      if (res.ok) setUsers(await res.json());
    } catch (err) {
      console.error("Lỗi tải khách hàng", err);
    } finally {
      setLoading(false);
    }
  };

  // --- EFFECT: Load data khi chuyển tab ---
  useEffect(() => {
    if (!domain) return;
    if (adminTab === "dashboard") fetchDashboardStats();
    if (adminTab === "orders") fetchOrders();
    if (adminTab === "products") fetchProducts();
    if (adminTab === "customers") fetchUsers();
  }, [adminTab, domain]);

  // Reload orders khi filter/search thay đổi (debounce nhẹ nếu cần, ở đây gọi trực tiếp cho đơn giản)
  useEffect(() => {
    if (adminTab === "orders") fetchOrders();
  }, [statusFilter, orderSearch]); // Bỏ dependency orderSearch nếu muốn search on enter

  // --- HANDLERS: ORDERS ---
  const updateOrderStatus = async (orderId, newStatus) => {
    if (
      !window.confirm(
        `Xác nhận chuyển trạng thái đơn #${orderId} sang ${newStatus}?`
      )
    )
      return;

    try {
      const res = await fetch(`${domain}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update local state
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
        }
        alert("Cập nhật thành công!");
      } else {
        alert("Lỗi cập nhật trạng thái");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối");
    }
  };

  // --- HANDLERS: PRODUCTS ---
  const openProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setProductForm(product);
    } else {
      setEditingProduct(null);
      setProductForm({
        name: "",
        category: "linh-kien",
        price: 0,
        stock: 10,
        brand: "",
        image: "",
        description: "",
      });
    }
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct
        ? `${domain}/api/products/${editingProduct.id}`
        : `${domain}/api/products`;
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productForm),
      });

      if (res.ok) {
        alert(editingProduct ? "Đã cập nhật sản phẩm" : "Đã thêm sản phẩm mới");
        setIsProductModalOpen(false);
        fetchProducts(); // Reload list
      } else {
        alert("Lỗi lưu sản phẩm");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
    try {
      const res = await fetch(`${domain}/api/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Không thể xóa sản phẩm");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- HANDLERS: USERS ---
  const handleUpdateUserPoints = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch(
        `${domain}/api/admin/users/${editingUser.id}/points`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ points: parseInt(userPointsForm) }),
        }
      );

      if (res.ok) {
        alert("Đã cập nhật điểm thành viên");
        setEditingUser(null);
        fetchUsers(); // Reload list để cập nhật cả Tier
      } else {
        alert("Lỗi cập nhật điểm");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- HELPERS UI ---
  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "SHIPPING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status) => {
    const map = {
      PENDING: "Chờ xử lý",
      SHIPPING: "Đang giao",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return map[status] || status;
  };

  // Filter local (nếu API không support filter sâu)
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [products, productSearch]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  return (
    <div className="container mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      {/* Header Dashboard */}
      <div className="bg-gray-900 text-white p-6 rounded-xl mb-6 flex justify-between items-center shadow-lg">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <LayoutDashboard /> Admin Dashboard
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Quản lý toàn bộ hệ thống bán hàng
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm bg-blue-600 px-3 py-1 rounded font-bold mb-1">
            Admin
          </div>
          <p className="text-xs text-gray-400">
            Xin chào, {user?.name || "Quản trị viên"}
          </p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="bg-white rounded-xl shadow-sm border mb-6 flex overflow-hidden">
        {[
          { id: "dashboard", label: "Tổng quan" },
          { id: "orders", label: "Đơn hàng" },
          { id: "products", label: "Sản phẩm" },
          { id: "customers", label: "Khách hàng" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            className={`flex-1 py-4 font-bold text-sm uppercase tracking-wide transition-colors ${
              adminTab === tab.id
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="bg-white rounded-xl shadow-sm border min-h-[500px]">
        {/* ================= 0. DASHBOARD ================= */}
        {adminTab === "dashboard" && (
          <div className="p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              Thống kê kinh doanh
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <p className="text-blue-600 font-medium mb-2">
                  Doanh thu (Hoàn thành)
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.income.toLocaleString()}đ
                </p>
              </div>
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
                <p className="text-yellow-600 font-medium mb-2">
                  Đơn chờ xử lý
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.newOrders}
                </p>
              </div>
              <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                <p className="text-red-600 font-medium mb-2">
                  Sản phẩm sắp hết
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.lowStock}
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                <p className="text-purple-600 font-medium mb-2">
                  Tổng khách hàng
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {stats.customers}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= 1. QUẢN LÝ ĐƠN HÀNG ================= */}
        {adminTab === "orders" && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Tìm mã đơn (ID)..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {["ALL", "PENDING", "SHIPPING", "COMPLETED", "CANCELLED"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                        statusFilter === status
                          ? "bg-gray-800 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {status === "ALL" ? "Tất cả" : getStatusLabel(status)}
                    </button>
                  )
                )}
                <button
                  onClick={fetchOrders}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                  title="Làm mới"
                >
                  <RefreshCw size={18} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="p-4 border-b">Mã đơn</th>
                      <th className="p-4 border-b">Khách hàng</th>
                      <th className="p-4 border-b">Ngày đặt</th>
                      <th className="p-4 border-b">Tổng tiền</th>
                      <th className="p-4 border-b">Trạng thái</th>
                      <th className="p-4 border-b text-center">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-8 text-center text-gray-500"
                        >
                          Không tìm thấy đơn hàng nào.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-blue-50/50 transition-colors"
                        >
                          <td className="p-4 font-bold text-gray-800">
                            #{order.id}
                          </td>
                          <td className="p-4">
                            <div className="font-medium">
                              {order.customer_name || "Khách lẻ"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.customer_email}
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">
                            {new Date(order.created_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </td>
                          <td className="p-4 font-bold text-blue-600">
                            {order.final_amount?.toLocaleString()}đ
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-blue-600 hover:bg-blue-100 p-2 rounded-full transition"
                              title="Xem chi tiết"
                            >
                              <Eye size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= 2. QUẢN LÝ SẢN PHẨM ================= */}
        {adminTab === "products" && (
          <div className="p-6">
            <div className="flex justify-between mb-6">
              <div className="relative max-w-md w-full">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Tìm tên sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => openProductModal()}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700"
              >
                <Plus size={18} /> Thêm sản phẩm
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                    <tr>
                      <th className="p-4 border-b">ID</th>
                      <th className="p-4 border-b">Hình ảnh</th>
                      <th className="p-4 border-b">Tên sản phẩm</th>
                      <th className="p-4 border-b">Giá bán</th>
                      <th className="p-4 border-b">Tồn kho</th>
                      <th className="p-4 border-b text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="p-4 text-gray-500">#{p.id}</td>
                        <td className="p-4">
                          <img
                            src={p.image_url || p.image}
                            alt=""
                            className="w-12 h-12 object-contain border rounded bg-white mix-blend-multiply"
                          />
                        </td>
                        <td className="p-4 font-medium">
                          {p.name}
                          <div className="text-xs text-gray-400 uppercase">
                            {p.category_id || p.category}
                          </div>
                        </td>
                        <td className="p-4">{p.price?.toLocaleString()}đ</td>
                        <td
                          className={`p-4 font-bold ${
                            p.stock_quantity < 10
                              ? "text-red-500"
                              : "text-gray-700"
                          }`}
                        >
                          {p.stock_quantity}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => openProductModal(p)}
                              className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-red-600 hover:bg-red-50 p-2 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= 3. QUẢN LÝ KHÁCH HÀNG ================= */}
        {adminTab === "customers" && (
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Tìm tên, email khách hàng..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-4 border-b">Khách hàng</th>
                      <th className="p-4 border-b">Liên hệ</th>
                      <th className="p-4 border-b">Ngày tham gia</th>
                      <th className="p-4 border-b">Hạng thành viên</th>
                      <th className="p-4 border-b">Điểm tích lũy</th>
                      <th className="p-4 border-b text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="p-4">
                          <div className="font-bold text-gray-800">
                            {u.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[100px]">
                            ID: {u.id}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">{u.email}</div>
                          <div className="text-xs text-gray-500">
                            {u.phone || "---"}
                          </div>
                        </td>
                        <td className="p-4 text-gray-600">
                          {new Date(u.created_at).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              LOYALTY_LEVELS[u.loyalty_tier]?.bg
                            } ${LOYALTY_LEVELS[u.loyalty_tier]?.color}`}
                          >
                            {LOYALTY_LEVELS[u.loyalty_tier]?.label ||
                              u.loyalty_tier}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-blue-600">
                          {u.loyalty_points}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => {
                              setEditingUser(u);
                              setUserPointsForm(u.loyalty_points);
                            }}
                            className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1 text-xs font-bold border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-50 mx-auto"
                          >
                            <Edit size={14} /> Sửa điểm
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= MODAL: CHI TIẾT ĐƠN HÀNG ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-gray-50 border-b p-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  Chi tiết đơn hàng #{selectedOrder.id}
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </h3>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Clock size={14} /> Ngày đặt:{" "}
                  {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <XCircle size={28} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <Users size={16} /> Người nhận (DB chưa có field này)
                  </h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    {/* Tạm thời hiển thị user info vì DB chưa lưu shippingInfo riêng */}
                    <p>
                      <span className="font-semibold">Tên:</span>{" "}
                      {selectedOrder.customer_name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {selectedOrder.customer_email}
                    </p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <DollarSign size={16} /> Thanh toán
                  </h4>
                  <div className="space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold">Hình thức:</span> VIETQR /
                      COD
                    </p>
                    <p>
                      <span className="font-semibold">Tổng tiền:</span>{" "}
                      <span className="text-lg font-bold text-green-700">
                        {selectedOrder.final_amount?.toLocaleString()}đ
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Lưu ý: Cần fetch items của order này nếu API list order chưa trả về items */}
              <div className="p-4 bg-gray-100 rounded text-center text-gray-500 text-sm">
                (Danh sách sản phẩm chi tiết sẽ được hiển thị nếu API hỗ trợ trả
                về items trong danh sách đơn hàng hoặc gọi thêm API detail)
              </div>
            </div>

            <div className="bg-gray-50 border-t p-4 flex flex-wrap justify-end gap-3">
              {selectedOrder.status === "PENDING" && (
                <>
                  <button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, "CANCELLED")
                    }
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200"
                  >
                    Hủy đơn
                  </button>
                  <button
                    onClick={() =>
                      updateOrderStatus(selectedOrder.id, "SHIPPING")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Truck size={18} /> Xác nhận giao hàng
                  </button>
                </>
              )}
              {selectedOrder.status === "SHIPPING" && (
                <button
                  onClick={() =>
                    updateOrderStatus(selectedOrder.id, "COMPLETED")
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle size={18} /> Xác nhận hoàn thành
                </button>
              )}
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: THÊM / SỬA SẢN PHẨM ================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold">
                {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-gray-400 hover:text-red-500"
              >
                <XCircle />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thương hiệu
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={productForm.brand}
                    onChange={(e) =>
                      setProductForm({ ...productForm, brand: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá bán (VNĐ)
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={productForm.price}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        price: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tồn kho
                  </label>
                  <input
                    required
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={productForm.stock || productForm.stock_quantity}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        stock: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục (ID)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="Nhập Category ID (1,2...)"
                    className="w-full border rounded px-3 py-2"
                    value={productForm.category_id || 1}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        category_id: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Hình ảnh
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      placeholder="https://..."
                      value={productForm.image || productForm.image_url}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          image: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows="3"
                  className="w-full border rounded px-3 py-2"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({
                      ...productForm,
                      description: e.target.value,
                    })
                  }
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save size={18} /> Lưu sản phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: SỬA ĐIỂM THÀNH VIÊN ================= */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b pb-2">
              <h3 className="text-xl font-bold">Chỉnh sửa Loyalty</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-red-500"
              >
                <XCircle />
              </button>
            </div>
            <form onSubmit={handleUpdateUserPoints} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khách hàng
                </label>
                <input
                  type="text"
                  value={editingUser.name}
                  disabled
                  className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-sm text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Điểm tích lũy mới
                </label>
                <input
                  type="number"
                  value={userPointsForm}
                  onChange={(e) => setUserPointsForm(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hạng thành viên sẽ tự động cập nhật sau khi lưu.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 flex justify-center items-center gap-2"
                >
                  <Save size={18} /> Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
