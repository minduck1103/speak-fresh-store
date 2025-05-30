import React from "react";
import { useTranslation } from "react-i18next";
import fruitsSplash from "../../assets/fruits-splash.png";

const Banner = () => {
  const { t } = useTranslation();
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
          <h2 className="text-4xl font-bold mb-6">{t('home.banners.about_us', { ns: 'pages' })}</h2>
          <p className="text-gray-600 mb-4">
            {t('home.banners.about_description', { ns: 'pages' })}
          </p>
          <button className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600">
            {t('home.banners.explore_now', { ns: 'pages' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Banner;
