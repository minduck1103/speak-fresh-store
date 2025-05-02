import React from "react";
import fruitsSplash from "../../assets/fruits-splash.png";

const Banner = () => {
  return (
    <div className="bg-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={fruitsSplash}
            alt="Fruits splash"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="py-4">
          <h2 className="text-4xl font-bold mb-6">VỀ CHÚNG TÔI</h2>
          <p className="text-gray-600 mb-4">
            Speak Fresh là nơi bạn tìm thấy những loại trái cây tươi ngon yêu thích! Chúng tôi chọn lọc kỹ càng trái cây Việt Nam và nhập khẩu, đảm bảo chất lượng tốt nhất khi đến tay bạn tại TP.HCM. Mua sắm dễ dàng, nhận hàng nhanh chóng – Thưởng thức vị ngon tự nhiên chưa bao giờ đơn giản hơn thế!
          </p>
          <button className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600">
            Khám phá ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
