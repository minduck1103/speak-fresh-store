import { useState } from 'react';
import contactHero from '../assets/contact-hero.jpg';
import { motion } from 'framer-motion';
import { fadeIn, slideIn, staggerContainer, textVariant, scaleIn } from '../utility/animation';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement contact form submission
    console.log('Contact form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Địa chỉ",
      content: "Số 5 Công trường Mê Linh, Quận 1, TP.HCM"
    },
    {
      icon: "📞",
      title: "Điện thoại",
      content: "(+84) 123 456 789"
    },
    {
      icon: "📧",
      title: "Email",
      content: "contact@peakfresh.com"
    },
    {
      icon: "⏰",
      title: "Giờ làm việc",
      content: "Thứ 2 - Chủ nhật: 8:00 - 20:00"
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
              src={contactHero}
              alt="Contact us background"
              className="w-full h-48 md:h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent flex flex-col items-start justify-end text-white p-6 md:p-10">
              <motion.h1 
                variants={textVariant(0.5)}
                className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg text-left max-w-lg font-serif"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Liên hệ với chúng tôi
              </motion.h1>
              <motion.p 
                variants={textVariant(0.7)}
                className="text-base md:text-xl font-medium drop-shadow text-left max-w-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Info Section */}
      <motion.div 
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="py-12 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={scaleIn(0.3 + index * 0.1)}
                className="text-center"
              >
                <div className="text-4xl mb-4">{info.icon}</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contact Form Section */}
      <motion.div 
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="py-16 bg-gray-50"
      >
        <motion.div 
          variants={fadeIn('up', 0.3)}
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-6 py-8">
              <motion.h2 
                variants={textVariant(0.5)}
                className="text-2xl font-bold text-gray-900 text-center mb-8"
              >
                Gửi tin nhắn cho chúng tôi
              </motion.h2>
              <motion.form 
                variants={fadeIn('up', 0.7)}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                      Chủ đề
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="subject"
                        id="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Nội dung tin nhắn
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Gửi tin nhắn
                  </button>
                </div>
              </motion.form>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Map Section */}
      <motion.div 
        variants={fadeIn('up', 0.3)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="h-96 bg-gray-200"
      >
        {/* Add Google Maps or other map service here */}
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Bản đồ Google Maps sẽ được hiển thị ở đây
        </div>
      </motion.div>
    </div>
  );
};

export default Contact; 