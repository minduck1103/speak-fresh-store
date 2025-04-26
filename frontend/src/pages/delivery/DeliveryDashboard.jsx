import React from "react";

const DeliveryDashboard = ({ totalOrders = 0, statusCounts = {} }) => {
  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-green-700 mb-8 text-center flex items-center justify-center gap-2">
        <span role="img" aria-label="fruit">🍋</span> Delivery Dashboard <span role="img" aria-label="fruit">🍈</span>
      </h1>
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-green-100 rounded-xl shadow-lg p-8 flex flex-col items-center">
          <div className="text-5xl mb-4">📦</div>
          <div className="text-2xl font-bold text-green-700">{totalOrders}</div>
          <div className="text-lg text-green-800 mt-2">Tổng số đơn hàng</div>
        </div>
        {Object.entries(statusCounts).map(([status, count]) => (
          <div key={status} className="bg-green-100 rounded-xl shadow-lg p-8 flex flex-col items-center">
            <div className="text-3xl mb-2">🍏</div>
            <div className="text-xl font-bold text-green-700">{count}</div>
            <div className="text-green-800 mt-1">{status}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryDashboard; 