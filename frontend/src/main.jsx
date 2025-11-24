import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ShopProvider, useShop } from "./context/ShopContext";
import { Package } from "lucide-react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useStore } from "./store";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import CartPage from "./pages/CartPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CheckoutPage from "./pages/CheckoutPage"; // Import mới
import OrderSuccessPage from "./pages/OrderSuccessPage";
import MyOrdersPage from "./pages/MyOrdersPage";

// Component con để hiển thị notification (cần nằm trong Provider)
const Notification = () => {
  const { notification } = useShop();
  if (!notification) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded shadow-lg animate-bounce flex items-center gap-2 z-50">
      <Package size={18} className="text-green-400" /> {notification}
    </div>
  );
};

export default function MainContent() {
  const [state] = useStore();
  return (
    <GoogleOAuthProvider clientId={`${state.clientId}`}>
      <ShopProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/order/:id" element={<OrderSuccessPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </main>
            <Footer />
            <Notification />
          </div>
        </Router>
      </ShopProvider>
    </GoogleOAuthProvider>
  );
}
