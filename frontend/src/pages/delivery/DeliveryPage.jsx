import React, { useState } from "react";
import { FaBars, FaTimes, FaTachometerAlt, FaTruck } from "react-icons/fa";
import DeliveryDashboard from "./DeliveryDashboard";
import DeliveryOrderList from "./DeliveryOrderList";
import Footer from "../../components/Footer/Footer";

const SIDEBAR = [
  { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { key: "orders", label: "Đơn hàng", icon: <FaTruck /> },
];

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleUpdateStatus = (order) => {
    // TODO: Thực hiện cập nhật trạng thái đơn hàng (gọi API)
    alert(`Cập nhật trạng thái cho đơn hàng ${order._id}`);
  };

  return (
    <div className="bg-green-50 min-h-screen flex flex-col">
      <div>
        <div className="max-w-[1440px] w-full mx-auto px-2 md:px-8">
          <div className="flex">
            {/* Hamburger button for mobile */}
            <button
              className="md:hidden fixed top-4 left-4 z-40 p-2 bg-green-700 text-white rounded-lg shadow-lg"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <FaBars size={22} />
            </button>
            {/* Overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}
            {/* Sidebar dọc */}
            <aside
              className={`fixed z-40 md:static top-0 left-0 h-full md:h-auto bg-white shadow-lg border-r border-green-100 flex flex-col py-8 rounded-r-3xl transition-all duration-200
              ${sidebarOpen ? 'w-56' : 'w-0 md:w-56'} overflow-hidden md:overflow-visible`}
            >
              <div className="flex items-center justify-between mb-8 px-6">
                <span className="text-2xl font-bold text-green-700 flex items-center gap-2"><FaTruck className="text-green-600" /> Delivery</span>
                <button className="md:hidden text-green-700 ml-2" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu">
                  <FaTimes size={22} />
                </button>
              </div>
              <nav className="flex-1 flex flex-col gap-1">
                {SIDEBAR.map(item => (
                  <button
                    key={item.key}
                    className={`flex items-center gap-3 px-6 py-3 text-lg rounded-l-full transition-colors mb-2 ${tab === item.key ? 'bg-green-100 text-green-700 font-bold' : 'hover:bg-green-50 text-green-600'}`}
                    onClick={() => { setTab(item.key); setSidebarOpen(false); }}
                  >
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
              </nav>
            </aside>
            {/* Main content */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <div className="flex gap-4 justify-center mb-8 mt-8 md:hidden">
                  {/* Ẩn nút tab trên mobile vì đã có sidebar */}
        </div>
                <div className="bg-white rounded-xl shadow-lg p-6 mt-8 md:mt-0">
          {tab === "dashboard" && <DeliveryDashboard totalOrders={mockTotalOrders} statusCounts={mockStatusCounts} />}
          {tab === "orders" && <DeliveryOrderList orders={mockOrders} onUpdateStatus={handleUpdateStatus} />}
        </div>
      </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DeliveryPage; 