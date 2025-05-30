import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FadeUp, FadeRight } from "../../utility/animation";
import fruitPlate from "../../assets/fruit-plate.png";

const Hero = () => {
  const { t } = useTranslation();
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
              <span className="block">{t('home.hero.title_1', { ns: 'pages' })}</span>
              <span className="block">{t('home.hero.title_2', { ns: 'pages' })} <span className="text-orange-400">{t('home.hero.title_3', { ns: 'pages' })}</span></span>
            </motion.h1>
            <motion.h2
              variants={FadeUp(0.5)}
              className="text-2xl font-semibold mb-4"
            >
              {t('home.hero.subtitle', { ns: 'pages' })}
            </motion.h2>
            <motion.p
              variants={FadeUp(0.6)}
              className="text-gray-600 mb-8"
            >
              {t('home.hero.description', { ns: 'pages' }).split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index < t('home.hero.description', { ns: 'pages' }).split('\n').length - 1 && <br />}
                </span>
              ))}
            </motion.p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-red-500 text-white px-8 py-3 rounded-full flex items-center hover:bg-red-600"
            >
              <span className="mr-2">🛍️</span>
              {t('home.hero.shop_now', { ns: 'pages' })}
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
