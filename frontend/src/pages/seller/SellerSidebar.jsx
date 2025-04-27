import React from "react";

const menu = [
  { key: "dashboard", label: "Tổng quan", icon: "📊" },
  { key: "products", label: "Sản phẩm của tôi", icon: "🍏" },
  { key: "orders", label: "Đơn hàng", icon: "🧾" },
  { key: "shipping", label: "Vận chuyển", icon: "🚚" },
  { key: "report", label: "Báo cáo", icon: "📈" },
  { key: "profile", label: "Hồ sơ cửa hàng", icon: "🏪" }
];

const SellerSidebar = ({ tab, setTab }) => (
  <aside className="bg-green-700 text-white w-64 min-h-screen p-6 flex flex-col gap-4 shadow-xl rounded-r-3xl">
    <h1 className="text-2xl font-extrabold mb-8 text-center tracking-wide">Seller Center</h1>
    <nav className="flex flex-col gap-2">
      {menu.map(item => (
        <button
          key={item.key}
          onClick={() => setTab(item.key)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg transition-colors ${tab === item.key ? 'bg-white text-green-700 shadow' : 'hover:bg-green-600'}`}
        >
          <span className="text-xl">{item.icon}</span> {item.label}
        </button>
      ))}
    </nav>
  </aside>
);

export default SellerSidebar; 