import React from "react";

const mockRevenue = [
  { date: "2024-06-01", value: 12000000 },
  { date: "2024-06-02", value: 15000000 },
  { date: "2024-06-03", value: 9000000 },
];

const mockBestProducts = [
  { name: "Bơ sáp Đắk Lắk", sold: 120 },
  { name: "Xoài cát Hòa Lộc", sold: 90 },
];

const mockBestCustomers = [
  { name: "Nguyễn Văn A", orders: 15 },
  { name: "Trần Thị B", orders: 12 },
];

const StatCard = ({ icon, label, value }) => (
  <div className="bg-green-100 rounded-xl p-6 flex flex-col items-center shadow-md">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="text-xl font-bold text-green-700">{value}</div>
    <div className="text-green-800 mt-1">{label}</div>
  </div>
);

const AdminReports = () => (
  <div>
    <h1 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">📊 Báo cáo & Thống kê</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard icon="💰" label="Doanh thu tháng" value="45,000,000₫" />
      <StatCard icon="🍉" label="Sản phẩm bán chạy" value={mockBestProducts[0].name} />
      <StatCard icon="👤" label="Khách hàng tiềm năng" value={mockBestCustomers[0].name} />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-bold text-green-700 mb-4">Doanh thu theo ngày</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-green-100">
              <th className="py-2 px-3">Ngày</th>
              <th className="py-2 px-3">Doanh thu</th>
            </tr>
          </thead>
          <tbody>
            {mockRevenue.map(r => (
              <tr key={r.date} className="border-b hover:bg-green-50">
                <td className="py-2 px-3">{r.date}</td>
                <td className="py-2 px-3">{r.value.toLocaleString()}₫</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-bold text-green-700 mb-4">Sản phẩm bán chạy</h2>
        <ul className="list-disc pl-6">
          {mockBestProducts.map(p => (
            <li key={p.name}>{p.name} - {p.sold} lượt bán</li>
          ))}
        </ul>
        <h2 className="text-lg font-bold text-green-700 mt-6 mb-4">Khách hàng mua nhiều</h2>
        <ul className="list-disc pl-6">
          {mockBestCustomers.map(c => (
            <li key={c.name}>{c.name} - {c.orders} đơn hàng</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default AdminReports; 