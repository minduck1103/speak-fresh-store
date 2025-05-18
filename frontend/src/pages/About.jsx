import React from 'react';
import aboutHero from '../assets/about-hero.jpg';
import { motion } from 'framer-motion';
import { fadeIn, slideIn, staggerContainer, textVariant, scaleIn } from '../utility/animation';

const About = () => {
  const values = [
    {
      icon: "🌱",
      title: "Nguồn gốc tự nhiên",
      description: "Chúng tôi cam kết cung cấp các sản phẩm trái cây tươi ngon, được trồng và thu hoạch từ những vùng đất màu mỡ nhất."
    },
    {
      icon: "✨",
      title: "Chất lượng hàng đầu",
      description: "Mỗi sản phẩm đều trải qua quy trình kiểm định nghiêm ngặt để đảm bảo đạt tiêu chuẩn chất lượng cao nhất."
    },
    {
      icon: "🌍",
      title: "Bền vững môi trường",
      description: "Chúng tôi áp dụng các phương pháp canh tác bền vững và thân thiện với môi trường trong toàn bộ quy trình sản xuất."
    },
    {
      icon: "🤝",
      title: "Đối tác tin cậy",
      description: "Xây dựng mối quan hệ bền vững với nông dân và đối tác, đảm bảo nguồn cung ổn định và chất lượng."
    }
  ];

  const milestones = [
    {
      year: "2018",
      title: "Khởi đầu hành trình",
      description: "PEAKFRESH được thành lập với sứ mệnh mang đến những sản phẩm trái cây tươi ngon nhất."
    },
    {
      year: "2019",
      title: "Mở rộng thị trường",
      description: "Phát triển mạng lưới đối tác và mở rộng phạm vi phục vụ trên toàn quốc."
    },
    {
      year: "2020",
      title: "Chuyển đổi số",
      description: "Ra mắt nền tảng thương mại điện tử, giúp khách hàng dễ dàng tiếp cận sản phẩm."
    },
    {
      year: "2023",
      title: "Phát triển bền vững",
      description: "Đạt chứng nhận về nông nghiệp bền vững và mở rộng quan hệ đối tác quốc tế."
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
                Về PEAKFRESH
              </motion.h1>
              <motion.p 
                variants={textVariant(0.7)}
                className="text-base md:text-xl font-medium drop-shadow text-left max-w-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Chúng tôi tin rằng mỗi người đều xứng đáng được thưởng thức những trái cây tươi ngon và bổ dưỡng nhất
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
              Giá trị cốt lõi
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
              Hành trình phát triển
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
                Sứ mệnh của chúng tôi
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                PEAKFRESH cam kết mang đến cho khách hàng những sản phẩm trái cây tươi ngon nhất, 
                được tuyển chọn kỹ lưỡng từ những vùng trồng uy tín trong và ngoài nước.
              </p>
              <p className="text-lg text-gray-600">
                Chúng tôi không ngừng nỗ lực cải tiến quy trình, ứng dụng công nghệ hiện đại 
                trong bảo quản và vận chuyển, đảm bảo trái cây luôn giữ được độ tươi ngon 
                khi đến tay người tiêu dùng.
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