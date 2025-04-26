import React from "react";

const AdminDashboard = ({ accountCount = 0, newOrderCount = 0 }) => {
  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="fruit">🍏</span> Trang quản trị - Dashboard <span role="img" aria-label="fruit">🍉</span>
      </h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-green-100 rounded-xl shadow-lg p-8 flex flex-col items-center">
          <div className="text-5xl mb-4">👤</div>
          <div className="text-2xl font-bold text-green-700">{accountCount}</div>
          <div className="text-lg text-green-800 mt-2">Tài khoản người dùng</div>
        </div>
        <div className="bg-green-100 rounded-xl shadow-lg p-8 flex flex-col items-center">
          <div className="text-5xl mb-4">🛒</div>
          <div className="text-2xl font-bold text-green-700">{newOrderCount}</div>
          <div className="text-lg text-green-800 mt-2">Đơn hàng mới</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 