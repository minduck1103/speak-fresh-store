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

// Function to export data as downloadable HTML file
const exportToHTML = () => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Speak Fresh - Admin Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 30px; }
            .stat-card { background: #f0fdf4; padding: 20px; border-radius: 8px; border: 1px solid #bbf7d0; }
            .stat-value { font-size: 24px; font-weight: bold; color: #15803d; }
            .stat-label { color: #166534; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f0fdf4; color: #15803d; font-weight: bold; }
            .section { margin-bottom: 30px; }
            .section-title { color: #15803d; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
            @media print { body { margin: 0; } }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🍃 SPEAK FRESH - ADMIN REPORT</h1>
            <p>Generated on: ${new Date().toLocaleDateString('vi-VN')}</p>
        </div>
        
        <div class="section">
            <h2 class="section-title">📊 Summary Statistics</h2>
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Revenue</div>
                    <div class="stat-value">${mockStats.totalRevenue.toLocaleString()}₫</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Orders</div>
                    <div class="stat-value">${mockStats.totalOrders.toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Customers</div>
                    <div class="stat-value">${mockStats.totalCustomers.toLocaleString()}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Monthly Growth</div>
                    <div class="stat-value">${mockStats.monthlyGrowth}</div>
                </div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">🏆 Top 5 Best-Selling Products</h2>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Sold</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockBestProducts.map(product => `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.sold}</td>
                            <td>${product.revenue.toLocaleString()}₫</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2 class="section-title">👥 Top 5 Loyal Customers</h2>
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Orders</th>
                        <th>Total Spent</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockBestCustomers.map(customer => `
                        <tr>
                            <td>${customer.name}</td>
                            <td>${customer.orders}</td>
                            <td>${customer.totalSpent.toLocaleString()}₫</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2 class="section-title">💰 Daily Revenue (Last 5 Days)</h2>
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Revenue</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockRevenue.map(day => `
                        <tr>
                            <td>${new Date(day.date).toLocaleDateString('vi-VN')}</td>
                            <td>${day.value.toLocaleString()}₫</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `speak-fresh-admin-report-${new Date().toISOString().split('T')[0]}.html`;
  link.click();
};

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
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">Export Report</h2>
              <button onClick={() => setShowExportModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600">Choose export format:</p>
              
              <button 
                onClick={() => {
                  window.print();
                  setShowExportModal(false);
                }}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                🖨️ Print Report
              </button>
              
              <button
                onClick={() => {
                  exportToHTML();
                  setShowExportModal(false);
                }}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                📄 Download HTML Report
              </button>
              
              <div className="text-sm text-gray-500 mt-4">
                <p>💡 Tip: HTML report can be opened in any browser and saved as PDF using Ctrl+P → Save as PDF</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;