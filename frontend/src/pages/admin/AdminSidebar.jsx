import React from "react";

const TABS = [
  { key: "dashboard", label: "Tổng quan", icon: "🍏" },
  { key: "customers", label: "Khách hàng", icon: "👤" },
  { key: "products", label: "Sản phẩm", icon: "🍉" },
  { key: "orders", label: "Đơn hàng", icon: "🧾" },
  { key: "shipping", label: "Vận chuyển", icon: "🚚" },
  { key: "reviews", label: "Đánh giá", icon: "⭐" },
  { key: "reports", label: "Báo cáo", icon: "📊" },
  { key: "settings", label: "Cấu hình", icon: "⚙️" },
];

const AdminSidebar = ({ tab, setTab }) => (
  <aside className="w-64 bg-green-700 text-white flex flex-col py-8 rounded-r-3xl shadow-lg min-h-screen">
    <div className="flex items-center justify-center mb-8">
      <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-2" />
      <span className="text-2xl font-bold">PEAKFRESH Admin</span>
    </div>
    {TABS.map(t => (
      <button
        key={t.key}
        className={`flex items-center gap-3 px-6 py-3 text-lg rounded-l-full transition-colors mb-2 ${tab === t.key ? "bg-green-100 text-green-700 font-bold" : "hover:bg-green-600"}`}
        onClick={() => setTab(t.key)}
      >
        <span>{t.icon}</span> {t.label}
      </button>
    ))}
  </aside>
);

export default AdminSidebar; 