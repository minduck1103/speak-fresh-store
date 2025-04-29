import { FaFileAlt, FaPlus } from 'react-icons/fa';

const ImportExportManagement = () => (
  <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    {/* Import */}
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2"><FaFileAlt /> Quản lý nhập kho</h2>
      <div className="mb-2 flex justify-between items-center">
        <span>Danh sách phiếu nhập kho</span>
        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1"><FaPlus />Tạo phiếu nhập</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-100 text-green-700">
              <th className="p-2">Mã phiếu</th>
              <th className="p-2">Nhà cung cấp</th>
              <th className="p-2">Ngày nhập</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">NK001</td>
              <td className="p-2">Công ty Hoa Quả Việt</td>
              <td className="p-2">2024-06-01</td>
              <td className="p-2"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Chờ duyệt</span></td>
              <td className="p-2"><button className="text-green-600 hover:underline">Chi tiết</button></td>
            </tr>
            {/* ...Thêm dữ liệu mẫu khác nếu cần */}
          </tbody>
        </table>
      </div>
    </div>
    {/* Export */}
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2"><FaFileAlt /> Quản lý xuất kho</h2>
      <div className="mb-2 flex justify-between items-center">
        <span>Danh sách phiếu xuất kho</span>
        <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-1"><FaPlus />Tạo phiếu xuất</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-100 text-green-700">
              <th className="p-2">Mã phiếu</th>
              <th className="p-2">Khách hàng/Đơn hàng</th>
              <th className="p-2">Ngày xuất</th>
              <th className="p-2">Trạng thái</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">XK001</td>
              <td className="p-2">Đơn hàng #123</td>
              <td className="p-2">2024-06-02</td>
              <td className="p-2"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Chờ xử lý</span></td>
              <td className="p-2"><button className="text-green-600 hover:underline">Chi tiết</button></td>
            </tr>
            {/* ...Thêm dữ liệu mẫu khác nếu cần */}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default ImportExportManagement; 