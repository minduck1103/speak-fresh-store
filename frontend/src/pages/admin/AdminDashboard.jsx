import React from "react";

const StatCard = ({ icon, label, value }) => (
  <div className="bg-green-100 rounded-xl p-6 flex flex-col items-center shadow-md">
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-2xl font-bold text-green-700">{value}</div>
    <div className="text-green-800 mt-1">{label}</div>
  </div>
);

const NotificationPanel = () => (
  <div className="bg-white rounded-xl p-4 shadow-md">
    <h3 className="font-bold text-green-700 mb-2">Thông báo & Cảnh báo</h3>
    <ul className="text-sm text-gray-700 space-y-1">
      <li>⚠️ 3 sản phẩm sắp hết hàng</li>
      <li>📝 2 phản hồi hỗ trợ mới</li>
      <li>⭐ 5 đánh giá mới chờ duyệt</li>
    </ul>
  </div>
);

const ReviewApprovalPanel = () => (
  <div className="bg-white rounded-xl p-4 shadow-md">
    <h3 className="font-bold text-green-700 mb-2">Đánh giá chờ duyệt</h3>
    <ul className="text-sm text-gray-700 space-y-1">
      <li>Nguyễn Văn A: "Sản phẩm rất ngon!" <button className="ml-2 text-red-500">Xóa</button></li>
      <li>Trần Thị B: "Đóng gói đẹp, giao nhanh." <button className="ml-2 text-red-500">Xóa</button></li>
    </ul>
  </div>
);

const AdminDashboard = () => (
  <div>
    <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">🍏 Tổng quan hệ thống</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard icon="👤" label="Khách hàng" value="1,234" />
      <StatCard icon="🧾" label="Đơn hàng mới" value="56" />
      <StatCard icon="🍉" label="Sản phẩm đang bán" value="120" />
      <StatCard icon="💰" label="Doanh thu hôm nay" value="12,000,000₫" />
      <StatCard icon="⭐" label="Đánh giá mới" value="8" />
      <StatCard icon="⚠️" label="Cảnh báo hết hàng" value="3" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <NotificationPanel />
      <ReviewApprovalPanel />
    </div>
  </div>
);

export default AdminDashboard; 