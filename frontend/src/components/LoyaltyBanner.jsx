import React from "react";
import { LOYALTY_LEVELS } from "../data/mockData";
import { Link } from "react-router-dom";

export default function LoyaltyBanner({ user }) {
  if (!user)
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl mb-8 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Tham gia Khách hàng thân thiết
            </h2>
            <p className="opacity-90">
              Tích điểm đổi quà, giảm giá lên đến 10% cho mỗi đơn hàng.
            </p>
          </div>
          <Link
            to="/login"
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-bold shadow hover:bg-gray-100"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    );

  const tierInfo = LOYALTY_LEVELS[user.loyalty_tier];
  const nextTierKey = Object.keys(LOYALTY_LEVELS).find(
    (key) => LOYALTY_LEVELS[key].min > user.loyalty_points
  );
  const nextTier = nextTierKey ? LOYALTY_LEVELS[nextTierKey] : null;
  const progress = nextTier
    ? ((user.loyalty_points - tierInfo.min) / (nextTier.min - tierInfo.min)) *
      100
    : 100;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Chào, {user.name}{" "}
            <span
              className={`text-sm px-2 py-0.5 rounded border ${tierInfo.color} border-current`}
            >
              {tierInfo.label}
            </span>
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Bạn đang có{" "}
            <span className="font-bold text-blue-600">
              {user.loyalty_points}
            </span>{" "}
            điểm
          </p>
        </div>
        <div className="text-right mt-2 md:mt-0">
          <p className="text-sm text-gray-600">Ưu đãi hiện tại</p>
          <p className="text-2xl font-bold text-green-600">
            Giảm {tierInfo.discount * 100}%
          </p>
        </div>
      </div>

      {nextTier && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{tierInfo.label}</span>
            <span>
              {nextTier.label} ({nextTier.min} điểm)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-center mt-2 text-gray-500">
            Cần thêm <strong>{nextTier.min - user.loyalty_points}</strong> điểm
            để thăng hạng
          </p>
        </div>
      )}
    </div>
  );
}
