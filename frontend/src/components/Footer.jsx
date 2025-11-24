import React from "react";
import { Zap, MapPin, Phone, Mail, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-12">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-white font-bold mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400" /> ĐỒ ĐIỆN TỬ
          </h4>
          <p className="text-sm">
            Chuyên cung cấp linh kiện, thiết bị điện tử chất lượng cao.
          </p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Chính sách</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="#" className="hover:text-white">
                Chính sách đổi trả
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Chương trình Loyalty
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Liên hệ</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Hà Nội, Việt Nam
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} /> 0987 654 321
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Đăng ký nhận tin</h4>
          <div className="flex">
            <input
              type="email"
              placeholder="Email"
              className="bg-gray-800 text-white px-3 py-2 rounded-l text-sm w-full outline-none"
            />
            <button className="bg-blue-600 text-white px-3 py-2 rounded-r">
              <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
