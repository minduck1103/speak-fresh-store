import React from "react";
import { motion } from "framer-motion";
import { FadeUp, FadeRight } from "../../utility/animation";
import fruitPlate from "../../assets/fruit-plate.png";

const Hero = () => {
  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={FadeUp(0.3)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h1 
              variants={FadeUp(0.4)}
              className="text-6xl font-bold mb-4"
            >
              <span className="block">Healthy</span>
              <span className="block">Fresh <span className="text-orange-400">Fruits!</span></span>
            </motion.h1>
            <motion.h2 
              variants={FadeUp(0.5)}
              className="text-2xl font-semibold mb-4"
            >
              Tiếp cận cuộc sống khỏe mạnh tươi mới
            </motion.h2>
            <motion.p 
              variants={FadeUp(0.6)}
              className="text-gray-600 mb-8"
            >
              Bữa sáng tươi ngon, lành mạnh.<br />
              Ăn mỗi ngày tốt cho sức khỏe và tinh thần<br />
              Đặt ngay, nhận ưu đãi 20% đơn đầu!
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white px-8 py-3 rounded-full flex items-center hover:bg-red-600"
            >
              <span className="mr-2">🛍️</span>
              Đặt hàng ngay
            </motion.button>
          </motion.div>
          <motion.div
            variants={FadeRight(0.5)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src={fruitPlate}
              alt="Fresh fruits"
              className="w-full"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
