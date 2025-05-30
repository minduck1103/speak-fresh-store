import React from 'react';
import { useTranslation } from 'react-i18next';
import aboutHero from '../assets/about-hero.jpg';
import { motion } from 'framer-motion';
import { fadeIn, slideIn, staggerContainer, textVariant, scaleIn } from '../utility/animation';

const About = () => {
  const { t } = useTranslation();
  const values = [
    {
      icon: "🌱",
      title: t('about.values.natural_origin', { ns: 'pages' }),
      description: t('about.values.natural_desc', { ns: 'pages' })
    },
    {
      icon: "✨",
      title: t('about.values.top_quality', { ns: 'pages' }),
      description: t('about.values.quality_desc', { ns: 'pages' })
    },
    {
      icon: "🌍",
      title: t('about.values.sustainable', { ns: 'pages' }),
      description: t('about.values.sustainable_desc', { ns: 'pages' })
    },
    {
      icon: "🤝",
      title: t('about.values.trusted_partner', { ns: 'pages' }),
      description: t('about.values.partner_desc', { ns: 'pages' })
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: t('about.milestones.2018_title', { ns: 'pages' }),
      description: t('about.milestones.2018_desc', { ns: 'pages' })
    },
    {
      year: "2019",
      title: t('about.milestones.2019_title', { ns: 'pages' }),
      description: t('about.milestones.2019_desc', { ns: 'pages' })
    },
    {
      year: "2020",
      title: t('about.milestones.2020_title', { ns: 'pages' }),
      description: t('about.milestones.2020_desc', { ns: 'pages' })
    },
    {
      year: "2023",
      title: t('about.milestones.2023_title', { ns: 'pages' }),
      description: t('about.milestones.2023_desc', { ns: 'pages' })
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="bg-gradient-to-b from-green-50 to-white py-8"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            variants={fadeIn('up', 0.3)}
            className="relative mb-10 rounded-3xl overflow-hidden shadow-lg"
          >
            <img
              src={aboutHero}
              alt="Fresh fruits background"
              className="w-full h-48 md:h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col items-start justify-end text-white p-6 md:p-10">
              <motion.h1
                variants={textVariant(0.5)}
                className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg text-left max-w-lg font-serif"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t('about.hero_title', { ns: 'pages' })}
              </motion.h1>
              <motion.p
                variants={textVariant(0.7)}
                className="text-base md:text-xl font-medium drop-shadow text-left max-w-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {t('about.hero_description', { ns: 'pages' })}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Values Section */}
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeIn('up', 0.3)}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('about.values_title', { ns: 'pages' })}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={scaleIn(0.3 + index * 0.1)}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Timeline Section */}
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="py-16 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('about.timeline_title', { ns: 'pages' })}
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative">
                  <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className="flex-1">
                      <div className={`p-6 bg-white rounded-lg shadow-sm ${index % 2 === 0 ? 'mr-8' : 'ml-8'}`}>
                        <span className="text-green-600 font-bold">{milestone.year}</span>
                        <h3 className="text-xl font-semibold text-gray-900 mt-1">
                          {milestone.title}
                        </h3>
                        <p className="mt-2 text-gray-600">
                          {milestone.description}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-green-600 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mission Section */}
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="py-16 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <motion.div variants={slideIn('left', 'tween', 0.3, 1)}>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('about.mission_title', { ns: 'pages' })}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.mission_description_1', { ns: 'pages' })}
              </p>
              <p className="text-lg text-gray-600">
                {t('about.mission_description_2', { ns: 'pages' })}
              </p>
            </motion.div>
            <motion.div
              variants={slideIn('right', 'tween', 0.3, 1)}
              className="mt-8 lg:mt-0"
            >
              <img
                src="/src/assets/banner-mission.jpg"
                alt="Our mission"
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;