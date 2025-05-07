import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const menu = [
  { key: "dashboard", label: "Tổng quan", icon: "📊" },
  { key: "products", label: "Sản phẩm", icon: "🍏" },
  { key: "orders", label: "Đơn hàng", icon: "🧾" },
    { key: "report", label: "Báo cáo", icon: "📈" },
  { key: "profile", label: "Hồ sơ", icon: "🏪" }
];

const SellerSidebar = ({ tab, setTab }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 p-2 bg-green-700 text-white rounded-lg shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Mở menu"
      >
        <FaBars size={22} />
      </button>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setOpen(false)}></div>
      )}
      {/* Sidebar */}
      <aside
        className={`
          ${open ? 'fixed z-40 top-0 left-0 w-64 h-full' : 'md:static md:w-64 md:h-auto'}
          bg-green-700 text-white flex flex-col py-8 rounded-r-3xl shadow-xl transition-all duration-200
          ${open ? 'overflow-hidden' : 'md:overflow-visible'}
        `}
        style={open ? {} : {}}
      >
        
        <nav className="flex-1 flex flex-col gap-2">
      {menu.map(item => (
        <button
          key={item.key}
              onClick={() => { setTab(item.key); setOpen(false); }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold text-lg transition-colors ${tab === item.key ? 'bg-white text-green-700 shadow' : 'hover:bg-green-600'}`}
        >
          <span className="text-xl">{item.icon}</span> {item.label}
        </button>
      ))}
    </nav>
  </aside>
    </>
);
};

export default SellerSidebar; 