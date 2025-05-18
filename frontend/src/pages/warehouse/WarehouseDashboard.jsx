import { useState } from 'react';
import { FaAppleAlt, FaBars, FaTimes } from 'react-icons/fa';
import QuickStats from './QuickStats';
import ChartsAlerts from './ChartsAlerts';
import InventoryManagement from './InventoryManagement';
import ImportExportManagement from './ImportExportManagement';
import Reports from './Reports';

const TABS = [
  { key: 'stats', label: 'Tổng quan', icon: <FaAppleAlt /> },
  { key: 'inventory', label: 'Hàng tồn kho', icon: '📦' },
  { key: 'importexport', label: 'Nhập/Xuất đơn', icon: '🔄' },
  { key: 'reports', label: 'Báo cáo', icon: '📊' },
];

const WarehouseDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 pt-20">
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
            style={{ minHeight: '100vh' }}
          >
            <div className="flex items-center justify-between mb-8 px-6">
              <span className="text-2xl font-bold text-green-700 flex items-center gap-2"><FaAppleAlt className="text-green-600" /> Warehouse</span>
              <button className="md:hidden text-green-700 ml-2" onClick={() => setSidebarOpen(false)} aria-label="Đóng menu">
                <FaTimes size={22} />
              </button>
            </div>
            <nav className="flex-1 flex flex-col gap-1">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  className={`flex items-center gap-3 px-6 py-3 text-lg rounded-l-full transition-colors mb-2 ${activeTab === tab.key ? 'bg-green-100 text-green-700 font-bold' : 'hover:bg-green-50 text-green-600'}`}
                  onClick={() => { setActiveTab(tab.key); setSidebarOpen(false); }}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </nav>
          </aside>
          {/* Main content */}
          <div className="flex-1 flex flex-col min-h-screen">
            <header className="mb-8 flex items-center gap-4 pt-8 px-4 md:px-0">
              <FaAppleAlt className="text-4xl text-green-600" />
              <h1 className="text-3xl font-bold text-green-700">Dashboard Kho - Warehouse</h1>
            </header>
            <main className="flex-1 w-full flex flex-col items-center">
              <div className="w-full max-w-7xl px-2 md:px-8">
                {activeTab === 'stats' && <><QuickStats /><ChartsAlerts /></>}
                {activeTab === 'inventory' && <InventoryManagement />}
                {activeTab === 'importexport' && <ImportExportManagement />}
                {activeTab === 'reports' && <Reports />}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarehouseDashboard; 