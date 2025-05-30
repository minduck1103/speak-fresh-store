import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FadeUp } from "../../utility/animation";

const Banner2 = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: "🌱",
      title: t('home.banners.quality_features.natural_origin', { ns: 'pages' }),
      description: t('home.banners.quality_features.natural_desc', { ns: 'pages' })
    },
    {
      icon: "✨",
      title: t('home.banners.quality_features.quality_commitment', { ns: 'pages' }),
      description: t('home.banners.quality_features.quality_desc', { ns: 'pages' })
    },
    {
      icon: "🚛",
      title: t('home.banners.quality_features.farm_to_table', { ns: 'pages' }),
      description: t('home.banners.quality_features.farm_desc', { ns: 'pages' })
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
            {t('home.banners.quality_commitment', { ns: 'pages' })}
          </h2>
          <p className="text-gray-600 mt-4">
            {t('home.banners.quality_description', { ns: 'pages' })}
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
            {t('home.banners.learn_more', { ns: 'pages' })}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Banner2;
