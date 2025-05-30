import React, { useState } from "react";
import { FaBars, FaTimes, FaTachometerAlt, FaTruck } from "react-icons/fa";
import DeliveryDashboard from "./DeliveryDashboard";
import DeliveryOrderList from "./DeliveryOrderList";
import api from "../../services/api";

const SIDEBAR = [
  { key: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
  { key: "orders", label: "Orders", icon: <FaTruck /> },
];

const DeliveryPage = () => {
  const [tab, setTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orderTab, setOrderTab] = useState('confirm'); // 'confirm' or 'list'
  const [orders, setOrders] = useState([]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/v1/orders');
      const orderList = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setOrders(orderList);
    } catch {
      setOrders([]);
    }
  };

  React.useEffect(() => {
    if (tab === 'orders') fetchOrders();
  }, [tab]);

  // Calculate data from orders
  const totalOrders = orders.length;
  const statusCounts = {
    'pending': orders.filter(o => o.status === 'pending').length,
    'waiting_pickup': orders.filter(o => o.status === 'waiting_pickup').length,
    'delivering': orders.filter(o => o.status === 'delivering').length,
    'delivered': orders.filter(o => o.status === 'delivered').length,
    'cancelled': orders.filter(o => o.status === 'cancelled').length,
    'failed': orders.filter(o => o.status === 'failed').length,
  };

  return (
    <div className="bg-green-50 min-h-screen flex flex-col pt-20" >
      <div>
        <div className="max-w-[1440px] w-full mx-auto px-2 md:px-8">
          <div className="flex">
            {/* Hamburger button for mobile */}
            <button
              className="md:hidden fixed top-4 left-4 z-40 p-2 bg-green-700 text-white rounded-lg shadow-lg"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
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
                <button className="md:hidden text-green-700 ml-2" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
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
          {tab === "dashboard" && <DeliveryDashboard totalOrders={totalOrders} statusCounts={statusCounts} />}
          {tab === "orders" && (
            <>
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setOrderTab('confirm')}
                  className={`px-5 py-2 rounded-full font-bold border-2 transition-colors ${orderTab === 'confirm' ? "bg-green-500 text-white border-green-500" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}
                >
                  Confirm order
                </button>
                <button
                  onClick={() => setOrderTab('list')}
                  className={`px-5 py-2 rounded-full font-bold border-2 transition-colors ${orderTab === 'list' ? "bg-green-500 text-white border-green-500" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}
                >
                  Orders delivering/delivered
                </button>
              </div>
              {orderTab === 'confirm' && <DeliveryOrderList orders={orders.filter(o => o.status === 'waiting_pickup')} confirmMode onReloadOrders={fetchOrders} />}
              {orderTab === 'list' && <DeliveryOrderList orders={orders.filter(o => ['delivering','delivered','failed'].includes(o.status))} onReloadOrders={fetchOrders} />}
            </>
          )}
        </div>
      </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage; 