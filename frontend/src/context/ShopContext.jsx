import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useContext,
} from "react";
import { MOCK_PRODUCTS, MOCK_USER, LOYALTY_LEVELS } from "../data/mockData";
import { useNavigate } from "react-router-dom";

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(MOCK_USER); // Default login for demo
  const [notification, setNotification] = useState(null);
  const [orders, setOrders] = useState([
    // Đơn mẫu 1: Mới đặt (Chờ thanh toán)
    {
      id: "746428",
      date: "24/11/2023",
      total: 147000,
      status: "PENDING", // Frame 1
      shippingInfo: { name: "Nguyễn Văn A", address: "Hà Nội", phone: "09..." },
      items: [
        {
          id: 1,
          name: "Arduino Uno R3",
          price: 150000,
          quantity: 1,
          image: "...",
        },
      ],
    },
    // Đơn mẫu 2: Đang vận chuyển
    {
      id: "102334",
      date: "20/11/2023",
      total: 500000,
      status: "SHIPPING", // Frame 3
      shippingInfo: { name: "Nguyễn Văn A", address: "Hà Nội", phone: "09..." },
      items: [
        { id: 4, name: "IC NE555", price: 5000, quantity: 100, image: "..." },
      ],
    },
    // Đơn mẫu 3: Đã hoàn thành
    {
      id: "998877",
      date: "15/10/2023",
      total: 85000,
      status: "COMPLETED", // Frame 4
      shippingInfo: { name: "Nguyễn Văn A", address: "Hà Nội", phone: "09..." },
      items: [
        {
          id: 2,
          name: "ESP8266 NodeMCU",
          price: 85000,
          quantity: 1,
          image: "...",
        },
      ],
    },
  ]);

  // Notification helper
  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Cart Actions
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotify(`Đã thêm ${product.name} vào giỏ`);
  };

  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id)
          return { ...item, quantity: Math.max(1, item.quantity + delta) };
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  // Auth Actions
  const login = () => setUser(MOCK_USER);
  const logout = () => {
    setUser(null);
    setCart([]); // Optional: clear cart on logout
  };

  // Pricing Logic (Memoized)
  const cartTotals = useMemo(() => {
    let subtotal = 0;
    let bulkDiscount = 0;

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      if (item.quantity >= 5) bulkDiscount += itemTotal * 0.05;
    });

    const loyaltyDiscountRate = user
      ? LOYALTY_LEVELS[user.loyalty_tier]?.discount || 0
      : 0;
    const loyaltyDiscount = (subtotal - bulkDiscount) * loyaltyDiscountRate;
    const finalTotal = subtotal - bulkDiscount - loyaltyDiscount;

    return { subtotal, bulkDiscount, loyaltyDiscount, finalTotal };
  }, [cart, user]);

  // Hàm đặt hàng
  const placeOrder = (shippingInfo) => {
    const newOrderId = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo ID ngẫu nhiên 6 số

    const newOrder = {
      id: newOrderId,
      date: new Date().toLocaleDateString("vi-VN"),
      items: [...cart],
      total: cartTotals.finalTotal,
      shippingInfo: shippingInfo, // { name, phone, address }
      status: "PENDING", // Chờ thanh toán
      paymentMethod: "VIETQR",
    };

    // Thêm vào danh sách đơn hàng
    setOrders((prev) => [newOrder, ...prev]);

    // Nếu có user đang login, thêm vào history của user đó (giả lập)
    if (user) {
      // Logic update user history (mock)
    }

    // Xóa giỏ hàng
    setCart([]);

    return newOrderId;
  };

  // --- THÊM HÀM NÀY VÀO ---
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // showNotify(`Đã cập nhật đơn ${orderId} thành ${newStatus}`); // Nếu muốn hiện thông báo
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        user,
        notification,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        login,
        logout,
        cartTotals,
        showNotify,
        orders,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};
