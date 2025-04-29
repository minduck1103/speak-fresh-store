import React, { useEffect, useState } from "react";
import { getOrders } from "../../services/orderService";
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

const SellerReport = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, bestSellers: [] });
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState({ revenue: [], orders: [] });

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getOrders();
        // Lọc đơn hàng có sản phẩm brand = 'green'
        const greenOrders = (res.data || []).filter(order =>
          (order.orderItems || []).some(item => item.brand === 'green')
        );
        setOrders(greenOrders);
        // Thống kê tổng
        let totalRevenue = 0;
        let totalOrders = greenOrders.length;
        const productMap = {};
        greenOrders.forEach(order => {
          (order.orderItems || []).forEach(item => {
            if (item.brand === 'green') {
              totalRevenue += (item.price || 0) * (item.quantity || 1);
              if (!productMap[item.name]) productMap[item.name] = { ...item, sold: 0 };
              productMap[item.name].sold += item.quantity || 1;
            }
          });
        });
        // Sản phẩm bán chạy
        const bestSellers = Object.values(productMap).sort((a, b) => b.sold - a.sold).slice(0, 5);
        setStats({ totalRevenue, totalOrders, bestSellers });
        setError("");
        // Thống kê theo tháng
        const revenueByMonth = Array(12).fill(0);
        const ordersByMonth = Array(12).fill(0);
        greenOrders.forEach(order => {
          const d = new Date(order.createdAt);
          if (d.getFullYear() === year) {
            const m = d.getMonth();
            ordersByMonth[m]++;
            (order.orderItems || []).forEach(item => {
              if (item.brand === 'green') {
                revenueByMonth[m] += (item.price || 0) * (item.quantity || 1);
              }
            });
          }
        });
        setMonthlyData({ revenue: revenueByMonth, orders: ordersByMonth });
      } catch {
        setError("Không thể tải dữ liệu báo cáo");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [year]);

  const years = Array.from(new Set(orders.map(o => new Date(o.createdAt).getFullYear())));

  const chartData = {
    labels: [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ],
    datasets: [
      {
        label: "Doanh thu (₫)",
        data: monthlyData.revenue,
        backgroundColor: "rgba(34,197,94,0.7)",
        borderRadius: 6,
      },
      {
        label: "Số đơn hàng",
        data: monthlyData.orders,
        backgroundColor: "rgba(59,130,246,0.5)",
        borderRadius: 6,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Doanh số theo tháng (${year})` }
    }
  };

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-400">Đang tải...</div>
        ) : (
          <>
            <div className="flex gap-4 items-center mb-6">
              <label className="font-bold text-green-700">Chọn năm:</label>
              <select value={year} onChange={e => setYear(Number(e.target.value))} className="border border-green-300 rounded px-3 py-2">
                {[...new Set([new Date().getFullYear(), ...years])].sort((a, b) => b - a).map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <Bar data={chartData} options={chartOptions} className="mb-10 bg-white" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-100 rounded-xl p-6 flex flex-col items-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="text-2xl font-bold text-green-700">{stats.totalRevenue.toLocaleString()}₫</div>
                <div className="text-green-800 mt-1">Tổng doanh thu</div>
              </div>
              <div className="bg-green-100 rounded-xl p-6 flex flex-col items-center">
                <div className="text-3xl mb-2">🧾</div>
                <div className="text-2xl font-bold text-green-700">{stats.totalOrders}</div>
                <div className="text-green-800 mt-1">Tổng số đơn hàng</div>
              </div>
              <div className="bg-green-100 rounded-xl p-6 flex flex-col items-center">
                <div className="text-3xl mb-2">🍏</div>
                <div className="text-2xl font-bold text-green-700">{stats.bestSellers[0]?.name || '-'}</div>
                <div className="text-green-800 mt-1">Sản phẩm bán chạy nhất</div>
              </div>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-green-700 mb-4">Top 5 sản phẩm bán chạy</h3>
              <table className="w-full border border-green-200 rounded-lg">
                <thead className="bg-green-100">
                  <tr>
                    <th className="py-2 px-3">Tên sản phẩm</th>
                    <th className="py-2 px-3">Số lượng đã bán</th>
                    <th className="py-2 px-3">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.bestSellers.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-6 text-gray-400">Không có dữ liệu</td></tr>
                  ) : (
                    stats.bestSellers.map((item, idx) => (
                      <tr key={idx} className="border-t border-green-50">
                        <td className="py-2 px-3 font-semibold text-green-700">{item.name}</td>
                        <td className="py-2 px-3">{item.sold}</td>
                        <td className="py-2 px-3">{item.price?.toLocaleString()}₫</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SellerReport; 