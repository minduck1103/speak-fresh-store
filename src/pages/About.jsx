import React from 'react';

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-green-600 py-24">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/src/assets/about-hero.jpg"
            alt="Fresh fruits background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Về PEAKFRESH
          </h1>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Chúng tôi tin rằng mỗi người đều xứng đáng được thưởng thức những trái cây tươi ngon và bổ dưỡng nhất
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Giá trị cốt lõi
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="py-16 bg-gray-50">
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
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
            <div>
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
            </div>
            <div className="mt-8 lg:mt-0">
              <img
                src="/src/assets/mission.jpg"
                alt="Our mission"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About; 