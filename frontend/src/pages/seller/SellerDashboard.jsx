import React from "react";

const mockData = {
  orderCount: 2847,
  revenue: 5230000000, // 5.23 tỷ VND
  productCount: 156,
  bestSeller: "Táo Fuji Nhật Bản",
  customerCount: 1234,
  reviewCount: 892,
  averageRating: 4.8,
  monthlyGrowth: "+25%",
  topCategories: ["Trái cây nhập khẩu", "Trái cây nội địa", "Giỏ quà tặng", "Combo trái cây", "Trái cây theo mùa"]
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-green-100 rounded-xl shadow-lg p-8 flex flex-col items-center">
    <div className="text-4xl mb-4">{icon}</div>
    <div className="text-2xl font-bold text-green-700">{value}</div>
    <div className="text-lg text-green-800 mt-2">{label}</div>
  </div>
);

const SellerDashboard = () => {
  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="fruit">🍇</span> Seller Dashboard <span role="img" aria-label="fruit">🍌</span>
      </h1>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon="📦" label="Orders" value={mockData.orderCount} />
          <StatCard icon="💰" label="Revenue" value={`${mockData.revenue.toLocaleString('vi-VN')}đ`} />
          <StatCard icon="📈" label="Monthly growth" value={mockData.monthlyGrowth} />
          <StatCard icon="⭐" label="Average rating" value={mockData.averageRating} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-green-700 mb-4">Store information</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Number of products</span>
                <span className="font-bold text-green-700">{mockData.productCount}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Number of customers</span>
                <span className="font-bold text-green-700">{mockData.customerCount}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-600">Number of reviews</span>
                <span className="font-bold text-green-700">{mockData.reviewCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Best seller</span>
                <span className="font-bold text-green-700">{mockData.bestSeller}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-green-700 mb-4">Top categories</h3>
            <div className="space-y-4">
              {mockData.topCategories.map((category, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">{category}</span>
                  <span className="font-bold text-green-700">{Math.floor(Math.random() * 50 + 10)} products</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;