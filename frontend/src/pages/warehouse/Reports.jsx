import { FaChartBar } from 'react-icons/fa';

const Reports = () => (
  <section className="bg-white rounded-xl shadow p-6 mb-8">
    <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2"><FaChartBar /> Báo cáo & Thống kê</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-700 mb-2">Báo cáo tồn kho</h3>
        <p className="text-green-800">Số lượng: 1200<br />Giá trị: ₫1,200,000<br />Hàng sắp hết: 2<br />Hàng tồn lâu ngày: 5</p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-700 mb-2">Báo cáo nhập/xuất kho</h3>
        <p className="text-green-800">Nhập: 300<br />Xuất: 250<br />Nhà cung cấp: 3<br />Khách hàng: 4</p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-700 mb-2">Báo cáo kiểm kê</h3>
        <p className="text-green-800">Chênh lệch kiểm kê: 2<br />Kiểm kê gần nhất: 2024-05-30</p>
      </div>
    </div>
  </section>
);

export default Reports; 