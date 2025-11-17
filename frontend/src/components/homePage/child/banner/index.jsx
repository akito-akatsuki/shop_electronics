import React, { useState, useCallback } from "react";
import "./style.scss";

import img1 from "./assets/img/ (1).jpg";
import img2 from "./assets/img/ (2).jpg";
import img3 from "./assets/img/ (3).jpg";
import img4 from "./assets/img/ (4).jpg";
import img5 from "./assets/img/ (5).jpg";
import img6 from "./assets/img/ (6).jpg";
import img7 from "./assets/img/ (7).jpg";
import img8 from "./assets/img/ (8).jpg";
import img9 from "./assets/img/ (9).jpg";
import img10 from "./assets/img/ (10).jpg";
import img11 from "./assets/img/ (11).jpg";
import img12 from "./assets/img/ (12).jpg";
import img13 from "./assets/img/ (13).jpg";
import img14 from "./assets/img/ (14).jpg";
import img15 from "./assets/img/ (15).jpg";
import img16 from "./assets/img/ (16).jpg";
import img17 from "./assets/img/ (17).jpg";
import img18 from "./assets/img/ (18).jpg";

const items = [
  img1,
  img2,
  img3,
  img4,
  img5,
  img6,
  img7,
  img8,
  img9,
  img10,
  img11,
  img12,
  img13,
  img14,
  img15,
  img16,
  img17,
  img18,
];

// Lặp lại mảng item để tạo hiệu ứng "vô hạn" mượt mà hơn
const infiniteItems = [...items, ...items, ...items];

const InfinityScrollGallery = () => {
  const [hoveredRow, setHoveredRow] = useState(null);

  // Xử lý sự kiện mouseEnter
  const handleMouseEnter = useCallback((rowId) => {
    setHoveredRow(rowId);
  }, []);

  // Xử lý sự kiện mouseLeave
  const handleMouseLeave = useCallback(() => {
    setHoveredRow(null);
  }, []);

  // Hàm render một hàng cuộn
  const renderRow = (rowId, directionClass) => {
    const isPaused = hoveredRow === rowId;

    return (
      <div
        className={`gallery-row ${directionClass} ${isPaused ? "paused" : ""}`}
        onMouseEnter={() => handleMouseEnter(rowId)}
        onMouseLeave={handleMouseLeave}
      >
        {infiniteItems.map((src, index) => (
          // Mỗi item có thể là một div chứa ảnh
          <div className="gallery-item" key={index}>
            <img src={src} alt={`Gallery item ${index}`} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="infinity-scroll-gallery">
      {/* Div 1: Trái sang phải */}
      {renderRow(1, "scroll-left")}

      {/* Div 2: Phải sang trái */}
      {renderRow(2, "scroll-right")}

      {/* Div 3: Trái sang phải */}
      {renderRow(3, "scroll-left")}
    </div>
  );
};

export default InfinityScrollGallery;
