import { FaBoxes, FaChartBar, FaFileAlt, FaBell } from 'react-icons/fa';

const stats = [
  { label: 'Tổng số lượng tồn kho', value: 1200, icon: <FaBoxes className="text-green-600" /> },
  { label: 'Giá trị tồn kho', value: '₫1,200,000', icon: <FaChartBar className="text-green-600" /> },
  { label: 'Đơn hàng chờ xử lý', value: 8, icon: <FaFileAlt className="text-green-600" /> },
  { label: 'Cảnh báo hết hàng', value: 2, icon: <FaBell className="text-red-500" /> },
];

const QuickStats = () => (
  <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {stats.map((stat, idx) => (
      <div key={idx} className="bg-white rounded-xl shadow p-6 flex items-center gap-4 border-l-8 border-green-400">
        <div className="text-3xl">{stat.icon}</div>
        <div>
          <div className="text-2xl font-bold text-green-700">{stat.value}</div>
          <div className="text-green-600 text-sm font-semibold">{stat.label}</div>
        </div>
      </div>
    ))}
  </section>
);

export default QuickStats; 