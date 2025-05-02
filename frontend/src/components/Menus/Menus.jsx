import React from "react";
import { motion } from "framer-motion";
import { FadeUp } from "../../utility/animation";
import apple from "../../assets/fruits/apple.png";
import orange from "../../assets/fruits/orange.png";
import avocado from "../../assets/fruits/avocado.png";
import cherry from "../../assets/fruits/cherry.png";

const Menus = () => {
  const fruits = [
    {
      id: 1,
      name: "Táo đỏ tươi",
      price: "110.000/kg",
      image: apple
    },
    {
      id: 2,
      name: "Cam tươi",
      price: "100.000/kg",
      image: orange
    },
    {
      id: 3,
      name: "Bơ tươi",
      price: "50.000/kg",
      image: avocado
    },
    {
      id: 4,
      name: "Cherry tươi",
      price: "280.000/kg",
      image: cherry
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 
          variants={FadeUp(0.2)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12"
        >
          Nổi bật
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {fruits.map((fruit, index) => (
            <motion.div
              key={fruit.id}
              variants={FadeUp(0.3 + index * 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  src={fruit.image}
                  alt={fruit.name}
                  className="w-16 h-16 object-contain"
                />
                <div className="ml-4">
                  <h3 className="font-medium">{fruit.name}</h3>
                  <p className="text-orange-400 font-medium">{fruit.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menus;
