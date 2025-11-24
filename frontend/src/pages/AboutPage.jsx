import React from "react";
import { CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* 1. Phần Tiêu đề (Hero Section) */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Chúng tôi là ĐỒ ĐIỆN TỬ
        </h1>
        <p className="text-lg text-gray-600">
          Đồng hành cùng cộng đồng Maker Việt Nam từ năm 2015. Chúng tôi cung
          cấp giải pháp linh kiện toàn diện cho mọi ý tưởng sáng tạo.
        </p>
      </div>

      {/* 2. Phần Thống kê (Stats Grid) - Phần hiển thị 4 ô vuông trong ảnh */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-blue-600 font-bold text-3xl mb-1">8+</div>
          <div className="text-gray-500 text-sm">Năm hoạt động</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-blue-600 font-bold text-3xl mb-1">10k+</div>
          <div className="text-gray-500 text-sm">Sản phẩm có sẵn</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-blue-600 font-bold text-3xl mb-1">50k+</div>
          <div className="text-gray-500 text-sm">Khách hàng tin dùng</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-blue-600 font-bold text-3xl mb-1">24/7</div>
          <div className="text-gray-500 text-sm">Hỗ trợ kỹ thuật</div>
        </div>
      </div>

      {/* 3. Phần Câu chuyện & Giá trị (Story & Values) */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=1000"
            alt="Electronics Lab"
            className="rounded-xl shadow-lg mb-6 w-full h-80 object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Câu chuyện của chúng tôi</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Xuất phát từ niềm đam mê với những con chip, vi mạch tại một phòng
            trọ nhỏ ở Hà Nội. Chúng tôi hiểu rõ khó khăn của sinh viên và kỹ sư
            khi tìm kiếm linh kiện chất lượng. ĐỒ ĐIỆN TỬ ra đời với sứ mệnh đơn
            giản hóa việc tiếp cận công nghệ phần cứng tại Việt Nam.
          </p>

          <h3 className="font-bold text-lg mb-3">Tại sao chọn chúng tôi?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
              <span>
                <strong className="text-gray-800">Chất lượng đảm bảo:</strong>{" "}
                100% linh kiện được kiểm tra trước khi nhập kho.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
              <span>
                <strong className="text-gray-800">Giá cả cạnh tranh:</strong>{" "}
                Chính sách giá tốt cho sinh viên và khách mua sỉ.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
              <span>
                <strong className="text-gray-800">Cộng đồng hỗ trợ:</strong>{" "}
                Tham gia Group hỗ trợ kỹ thuật với 20.000 thành viên.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
