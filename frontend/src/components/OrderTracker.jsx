import React from "react";
import { Check, Truck, Package, CreditCard } from "lucide-react";

export default function OrderTracker({ status }) {
  // Định nghĩa các bước của đơn hàng
  const STEPS = [
    { key: "PENDING", label: "Chờ thanh toán", icon: CreditCard },
    { key: "CONFIRMED", label: "Đã xác nhận", icon: Package },
    { key: "SHIPPING", label: "Đang vận chuyển", icon: Truck },
    { key: "COMPLETED", label: "Hoàn thành", icon: Check },
  ];

  // Logic xác định vị trí hiện tại
  // Nếu status là CANCELLED thì hiển thị riêng
  if (status === "CANCELLED") {
    return (
      <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center font-bold border border-red-200">
        Đơn hàng đã bị hủy
      </div>
    );
  }

  const activeIndex = STEPS.findIndex((s) => s.key === status);
  // Nếu không tìm thấy status (ví dụ status lạ), mặc định là 0
  const currentStep = activeIndex === -1 ? 0 : activeIndex;

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Đường kẻ nền (Line Background) */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>

        {/* Đường kẻ tiến độ (Active Line) */}
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-green-500 -z-10 transition-all duration-500"
          style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        ></div>

        {/* Các bước (Circles) */}
        {STEPS.map((step, index) => {
          const isActive = index <= currentStep;
          const isCurrent = index === currentStep;
          const Icon = step.icon;

          return (
            <div
              key={step.key}
              className="flex flex-col items-center bg-white px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${
                    isActive
                      ? "bg-green-500 border-green-500 text-white"
                      : "bg-white border-gray-300 text-gray-400"
                  }
                  ${isCurrent ? "ring-4 ring-green-100 scale-110" : ""}
                `}
              >
                <Icon size={18} />
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  isActive ? "text-green-700" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
