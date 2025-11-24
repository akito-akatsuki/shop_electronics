export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Arduino Uno R3",
    category: "module-cam-bien",
    price: 150000,
    image: "https://placehold.co/400x400/2563eb/white?text=Arduino",
    rating: 4.5,
    stock: 50,
    brand: "Arduino",
    // THÊM MỚI:
    description:
      "Arduino Uno R3 là dòng mạch in phổ biến nhất hiện nay. Sử dụng chip ATmega328P, phù hợp cho người mới bắt đầu học lập trình nhúng và IoT. Tương thích với hàng nghìn loại cảm biến và module mở rộng.",
    specs: [
      "Vi điều khiển: ATmega328P",
      "Điện áp: 5V",
      "Flash Memory: 32KB",
      "SRAM: 2KB",
    ],
  },
  {
    id: 2,
    name: "Module ESP8266 NodeMCU",
    category: "module-cam-bien",
    price: 85000,
    image: "https://placehold.co/400x400/2563eb/white?text=ESP8266",
    rating: 4.8,
    stock: 120,
    brand: "Espressif",
    description:
      "NodeMCU Lua V3 ESP8266 tích hợp Wifi, hỗ trợ lập trình dễ dàng qua Arduino IDE. Giải pháp giá rẻ và hiệu quả cho các dự án Smart Home.",
    specs: [
      "Chip: ESP8266-12E",
      "Wifi: 2.4GHz",
      "Giao tiếp: Micro USB",
      "GPIO: 10 chân",
    ],
  },
  // ... Các sản phẩm khác bạn giữ nguyên hoặc thêm description tương tự
  {
    id: 3,
    name: "Mỏ hàn điều chỉnh nhiệt 60W",
    category: "dung-cu",
    price: 120000,
    image: "https://placehold.co/400x400/dc2626/white?text=Solder",
    rating: 4.2,
    stock: 30,
    brand: "NoBrand",
    description:
      "Mỏ hàn nhiệt 60W lõi sứ, gia nhiệt nhanh, có núm điều chỉnh nhiệt độ từ 200-450 độ C.",
    specs: ["Công suất: 60W", "Nhiệt độ: 200-450°C"],
  },
  {
    id: 4,
    name: "IC NE555 Timer",
    category: "ic",
    price: 5000,
    image: "https://placehold.co/400x400/4b5563/white?text=NE555",
    rating: 5.0,
    stock: 1000,
    brand: "TI",
    description:
      "IC tạo xung huyền thoại, dùng trong mạch định thời, tạo xung vuông, dao động.",
    specs: ["Điện áp: 4.5V - 16V", "Dòng ra: 200mA"],
  },
  {
    id: 5,
    name: "Cảm biến siêu âm HC-SR04",
    category: "module-cam-bien",
    price: 25000,
    image: "https://placehold.co/400x400/2563eb/white?text=HC-SR04",
    rating: 4.0,
    stock: 80,
    brand: "Generic",
    description:
      "Cảm biến đo khoảng cách bằng sóng siêu âm, dải đo từ 2cm đến 400cm, độ chính xác cao.",
    specs: ["Điện áp: 5V", "Góc đo: <15 độ"],
  },
  {
    id: 6,
    name: "Đồng hồ vạn năng DT9205A",
    category: "dung-cu",
    price: 180000,
    image: "https://placehold.co/400x400/dc2626/white?text=Multimeter",
    rating: 4.6,
    stock: 15,
    brand: "Best",
    description:
      "Đồng hồ đo điện đa năng: đo Vol, Ampe, Ohm, tụ điện. Có bao da chống sốc, màn hình lớn dễ đọc.",
    specs: ["Hiển thị: LCD", "Nguồn: Pin 9V"],
  },
];

export const MOCK_USER = {
  id: "user_123",
  name: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
  picture: null,
  loyalty_points: 2450,
  loyalty_tier: "SILVER",
  history: [
    {
      id: 101,
      date: "2023-10-01",
      total: 500000,
      status: "COMPLETED",
      points: 50,
    },
    {
      id: 102,
      date: "2023-10-15",
      total: 1200000,
      status: "COMPLETED",
      points: 120,
    },
  ],
};

export const CATEGORIES = [
  { id: "all", name: "Tất cả" },
  { id: "linh-kien", name: "Linh kiện điện tử" },
  { id: "ic", name: "Mạch tích hợp (IC)" },
  { id: "module-cam-bien", name: "Module - Cảm biến" },
  { id: "dung-cu", name: "Dụng cụ sửa chữa" },
];

export const LOYALTY_LEVELS = {
  BRONZE: {
    min: 0,
    label: "Thành viên Mới",
    discount: 0,
    color: "text-amber-700",
    bg: "bg-amber-100",
  },
  SILVER: {
    min: 1000,
    label: "Bạc",
    discount: 0.02,
    color: "text-gray-500",
    bg: "bg-gray-100",
  },
  GOLD: {
    min: 5000,
    label: "Vàng",
    discount: 0.05,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  DIAMOND: {
    min: 10000,
    label: "Kim Cương",
    discount: 0.1,
    color: "text-cyan-600",
    bg: "bg-cyan-100",
  },
};
