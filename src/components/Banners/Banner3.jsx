import React from "react";
import { motion } from "framer-motion";
import { FadeLeft, FadeRight } from "../../utility/animation";

const Banner3 = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="relative h-[500px] bg-gray-100 rounded-2xl overflow-hidden grid grid-cols-2">
        {/* Left side - Image */}
        <motion.img
          variants={FadeRight(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          src="/src/assets/banner-bg.jpg"
          alt="Mixed fruits"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Right side - Content */}
        <motion.div 
          variants={FadeLeft(0.5)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="absolute inset-y-0 right-0 w-full max-w-md md:max-w-lg lg:max-w-xl p-8 sm:p-16 flex flex-col justify-center z-10"
        > 
          {/* Nội dung text */}
          <div className="relative">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              Trái cây tươi <br /> Có ngay hôm nay!
            </h2>
            <p className="text-gray-700 mb-8">
              Cần trái cây tươi ngon cho hôm nay? Speak Fresh cung cấp đa dạng lựa chọn, giao nhanh chóng tại TP.HCM để bạn thưởng thức ngay. 
            </p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white px-6 py-3 rounded-full flex items-center hover:bg-red-600 transition-colors"
            >
              <span className="mr-2">🛍️</span>
              Đặt Hàng Ngay
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner3;
