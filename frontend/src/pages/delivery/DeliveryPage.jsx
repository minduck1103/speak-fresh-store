import React, { useState } from "react";
import DeliveryDashboard from "./DeliveryDashboard";
import DeliveryOrderList from "./DeliveryOrderList";

const mockTotalOrders = 20;
const mockStatusCounts = {
  "Đang xử lý": 5,
  "Đang giao": 8,
  "Đã giao": 6,
  "Đã hủy": 1,
};
const mockOrders = [
  { _id: 1, customer: { name: "Nguyễn Văn A", phoneNo: "0123456789", address: "123 Đường A", city: "Hà Nội" }, createdAt: "2024-04-25T10:00:00Z", status: "Đang giao", totalPrice: 250000, items: [ { name: "Táo", quantity: 2, price: 50000 }, { name: "Chuối", quantity: 3, price: 50000 } ] },
  { _id: 2, customer: { name: "Trần Thị B", phoneNo: "0987654321", address: "456 Đường B", city: "HCM" }, createdAt: "2024-04-24T09:00:00Z", status: "Đã giao", totalPrice: 500000, items: [ { name: "Cam", quantity: 5, price: 100000 } ] },
];

const DeliveryPage = () => {
  const [tab, setTab] = useState("dashboard");

  const handleUpdateStatus = (order) => {
    // TODO: Thực hiện cập nhật trạng thái đơn hàng (gọi API)
    alert(`Cập nhật trạng thái cho đơn hàng ${order._id}`);
  };

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex gap-4 justify-center mb-8">
          <button onClick={() => setTab("dashboard")} className={`px-6 py-2 rounded-full font-bold border-2 transition-colors ${tab === "dashboard" ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}>Dashboard</button>
          <button onClick={() => setTab("orders")} className={`px-6 py-2 rounded-full font-bold border-2 transition-colors ${tab === "orders" ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}>Đơn hàng</button>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {tab === "dashboard" && <DeliveryDashboard totalOrders={mockTotalOrders} statusCounts={mockStatusCounts} />}
          {tab === "orders" && <DeliveryOrderList orders={mockOrders} onUpdateStatus={handleUpdateStatus} />}
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage; 