import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: "🍏" },
  { key: "customers", label: "Customers", icon: "👤" },
  { key: "products", label: "Products", icon: "🍉" },
  { key: "orders", label: "Orders", icon: "🧾" },
  { key: "shipping", label: "Shipping", icon: "🚚" },
  { key: "reviews", label: "Reviews", icon: "⭐" },
  { key: "reports", label: "Reports", icon: "📊" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

const AdminSidebar = ({ tab, setTab }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-green-700 text-white rounded-lg shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Menu"
      >
        <FaBars size={22} />
      </button>

      {/* Dark overlay for mobile */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden" 
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-40 h-full md:h-auto bg-green-700 text-white 
          transition-all duration-200 ease-in-out 
          ${open ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-64'} 
          rounded-r-3xl shadow-lg overflow-hidden md:overflow-visible
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-green-600">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <button 
            className="md:hidden text-white" 
            onClick={() => setOpen(false)}
          >
            <FaTimes size={22} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-1 p-4">
          {TABS.map(tabItem => (
            <button
              key={tabItem.key}
              className={`
                flex items-center gap-3 px-6 py-3 text-lg rounded-lg 
                transition-all duration-200 
                ${tab === tabItem.key 
                  ? "bg-white text-green-700 font-bold shadow-md" 
                  : "hover:bg-green-600/50"
                }
              `}
              onClick={() => { 
                setTab(tabItem.key); 
                setOpen(false); 
              }}
            >
              <span>{tabItem.icon}</span> 
              {tabItem.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;