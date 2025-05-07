import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

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

const AdminSidebar = ({ tab, setTab }) => {
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
        className={`fixed z-40 md:static top-0 left-0 md:h-auto bg-green-700 text-white flex flex-col py-8 rounded-r-3xl shadow-lg transition-all duration-200
        ${open ? 'w-64' : 'w-0 md:w-64'} overflow-hidden md:overflow-visible`}
      >

        <nav className="flex-1 flex flex-col gap-1">
    {TABS.map(t => (
      <button
        key={t.key}
        className={`flex items-center gap-3 px-6 py-3 text-lg rounded-l-full transition-colors mb-2 ${tab === t.key ? "bg-green-100 text-green-700 font-bold" : "hover:bg-green-600"}`}
              onClick={() => { setTab(t.key); setOpen(false); }}
      >
        <span>{t.icon}</span> {t.label}
      </button>
    ))}
        </nav>
  </aside>
    </>
);
};

export default AdminSidebar; 