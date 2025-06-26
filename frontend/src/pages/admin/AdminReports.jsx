import React, { useState } from "react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import htmlDocx from 'html-docx-js/dist/html-docx';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const mockStats = {
  totalRevenue: 5230000000,
  totalOrders: 2847,
  totalCustomers: 1234,
  totalProducts: 156,
  averageOrderValue: 1837372, // ~1.8tr
  bestSeller: "Táo Fuji Nhật Bản",
  monthlyGrowth: "+25%"
};

const mockRevenue = [
  { date: "2025-05-30", value: 22500000 },
  { date: "2025-05-29", value: 18700000 },
  { date: "2025-05-28", value: 25300000 },
  { date: "2025-05-27", value: 19800000 },
  { date: "2025-05-26", value: 21400000 },
];

const mockBestProducts = [
  { name: "Táo Fuji Nhật Bản", sold: 520, revenue: 780000000 },
  { name: "Nho đỏ không hạt Úc", sold: 380, revenue: 650000000 },
  { name: "Xoài cát Hòa Lộc", sold: 350, revenue: 525000000 },
  { name: "Dâu tây Đà Lạt", sold: 320, revenue: 480000000 },
  { name: "Bơ sáp Đắk Lắk", sold: 280, revenue: 420000000 },
];

const mockBestCustomers = [
  { name: "Nguyễn Văn A", orders: 45, totalSpent: 67500000 },
  { name: "Trần Thị B", orders: 38, totalSpent: 57000000 },
  { name: "Phạm Văn C", orders: 32, totalSpent: 48000000 },
  { name: "Lê Thị D", orders: 29, totalSpent: 43500000 },
  { name: "Hoàng Văn E", orders: 25, totalSpent: 37500000 },
];

const StatCard = ({ icon, label, value }) => (
  <div className="bg-green-100 rounded-xl p-6 flex flex-col items-center shadow-md">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-xl font-bold text-green-700">{value}</div>
    <div className="text-green-800 mt-1">{label}</div>
  </div>
);

const AdminReports = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">📊 Reports</h1>
        <button
          onClick={() => setShowExportModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          📊 Export report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon="💰" label="Total Revenue" value={mockStats.totalRevenue.toLocaleString() + "₫"} />
        <StatCard icon="📦" label="Total Orders" value={mockStats.totalOrders.toLocaleString()} />
        <StatCard icon="👥" label="Total Customers" value={mockStats.totalCustomers.toLocaleString()} />
        <StatCard icon="📈" label="Monthly Growth" value={mockStats.monthlyGrowth} />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-green-700 mb-4">Revenue Analysis</h2>
          <Bar 
            data={{
              labels: mockRevenue.map(r => new Date(r.date).toLocaleDateString('vi-VN')),
              datasets: [
                {
                  label: "Daily Revenue",
                  data: mockRevenue.map(r => r.value),
                  backgroundColor: "rgba(34,197,94,0.7)",
                  borderRadius: 6,
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Daily Revenue (Last 5 Days)' }
              }
            }}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-bold text-green-700 mb-4">Top 5 Best-Selling Products</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-50">
                  <th className="py-2 px-3 text-left">Product</th>
                  <th className="py-2 px-3 text-right">Sold</th>
                  <th className="py-2 px-3 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {mockBestProducts.map((product, index) => (
                  <tr key={product.name} className="border-b">
                    <td className="py-2 px-3 font-medium">{product.name}</td>
                    <td className="py-2 px-3 text-right">{product.sold}</td>
                    <td className="py-2 px-3 text-right">{product.revenue.toLocaleString()}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-bold text-green-700 mt-6 mb-4">Top 5 Loyal Customers</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-green-50">
                  <th className="py-2 px-3 text-left">Customer</th>
                  <th className="py-2 px-3 text-right">Orders</th>
                  <th className="py-2 px-3 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {mockBestCustomers.map((customer, index) => (
                  <tr key={customer.name} className="border-b">
                    <td className="py-2 px-3 font-medium">{customer.name}</td>
                    <td className="py-2 px-3 text-right">{customer.orders}</td>
                    <td className="py-2 px-3 text-right">{customer.totalSpent.toLocaleString()}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">Export Report</h2>
              <button onClick={() => setShowExportModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div id="admin-report-word-content" className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-green-700 mb-4">Summary Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Total Revenue</div>
                    <div className="text-2xl font-bold text-green-700">{mockStats.totalRevenue.toLocaleString()}₫</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Total Orders</div>
                    <div className="text-2xl font-bold text-green-700">{mockStats.totalOrders}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Average Order Value</div>
                    <div className="text-2xl font-bold text-green-700">{mockStats.averageOrderValue.toLocaleString()}₫</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600">Best Seller</div>
                    <div className="text-2xl font-bold text-green-700">{mockStats.bestSeller}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-2">
              <button 
                onClick={() => window.print()}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                🖨️ Print Report
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('admin-report-word-content');
                  const html = el.innerHTML;
                  const blob = htmlDocx.asBlob(html);
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = 'admin-report.docx';
                  link.click();
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                📄 Export Word
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;