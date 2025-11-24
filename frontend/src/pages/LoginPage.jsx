import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { Loader2, AlertCircle } from "lucide-react";
import { useStore, actions } from "../store";

export default function LoginPage() {
  const navigate = useNavigate();
  const [state, dispatch] = useStore();
  const { domain } = state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleServerLogin = async (googleData) => {
    try {
      setLoading(true);
      setError(null);

      // Lấy token: Ưu tiên access_token (từ useGoogleLogin hook)
      const token = googleData.access_token || googleData.credential;

      console.log("Gửi token lên server:", token); // Debug

      const response = await fetch(`${domain}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: token }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Đăng nhập thất bại");
      }

      const data = await response.json();

      dispatch(actions.set_is_login(true));
      dispatch(actions.setUser(data.user));
      navigate("/");
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError(err.message || "Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: handleServerLogin,
    onError: () => setError("Đăng nhập Google thất bại"),
  });

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-lg border w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Đăng nhập / Đăng ký</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <button
          onClick={() => loginGoogle()}
          disabled={loading}
          className={`w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition mb-4 ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-6 h-6"
              alt="Google"
            />
          )}
          {loading ? "Đang xử lý..." : "Tiếp tục với Google"}
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Bằng việc đăng nhập, bạn đồng ý với điều khoản sử dụng của ĐỒ ĐIỆN TỬ.
        </p>
      </div>
    </div>
  );
}
