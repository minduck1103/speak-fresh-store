import React from "react";
import { motion } from "framer-motion";
import { FadeUp } from "../../utility/animation";

const Banner2 = () => {
  const features = [
    {
      icon: "🌱",
      title: "Nguồn gốc Tự nhiên",
      description: "Trái cây được trồng và thu hoạch từ những vùng đất màu mỡ, đảm bảo nguồn gốc xuất xứ rõ ràng."
    },
    {
      icon: "✨",
      title: "Cam kết Chất lượng",
      description: "Mỗi sản phẩm đều trải qua quy trình kiểm định nghiêm ngặt, đảm bảo độ tươi ngon và an toàn."
    },
    {
      icon: "🚛",
      title: "Từ Nông trại đến Bàn ăn",
      description: "Rút ngắn chuỗi cung ứng, đưa trái cây tươi ngon từ nông trại đến tận tay người tiêu dùng."
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={FadeUp(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold">
          🌿NGUỒN GỐC CHẤT LƯỢNG🛡️
          </h2>
          <p className="text-gray-600 mt-4">
            Cam kết mang đến những sản phẩm tươi ngon nhất cho gia đình bạn
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={FadeUp(0.4 + index * 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={FadeUp(0.7)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 text-white px-8 py-3 rounded-full hover:bg-red-600 transition-colors duration-300"
          >
            Tìm hiểu thêm
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner2;
