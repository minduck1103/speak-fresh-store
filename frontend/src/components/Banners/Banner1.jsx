import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FadeUp, FadeLeft } from "../../utility/animation";

const Banner1 = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-orange-50 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            variants={FadeLeft(0.3)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={FadeLeft(0.4)}
              className="text-3xl font-bold mb-4"
            >
              {t('home.banners.fresh_daily', { ns: 'pages' })}
              <span className="text-orange-500"> {t('home.banners.fresh_daily_highlight', { ns: 'pages' })}</span>
            </motion.h2>
            <motion.p
              variants={FadeLeft(0.5)}
              className="text-gray-600 mb-8"
            >
              {t('home.banners.fresh_daily_desc', { ns: 'pages' })}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white px-6 py-3 rounded-full flex items-center hover:bg-red-600"
            >
              <span className="mr-2">🎁</span>
              {t('home.banners.explore_now', { ns: 'pages' })}
            </motion.button>
          </motion.div>
          <motion.div
            variants={FadeUp(0.5)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="/src/assets/banner1-fruits.png"
              alt="Fresh fruits collection"
              className="w-full"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Banner1;