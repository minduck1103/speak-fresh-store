import { useState } from 'react';
import { FaBoxes, FaPlus, FaSearch } from 'react-icons/fa';

const InventoryManagement = () => {
  const [search, setSearch] = useState('');
  return (
    <section className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="text-lg font-bold text-green-700 flex items-center gap-2"><FaBoxes /> Danh sách sản phẩm trong kho</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600"><FaSearch />Tìm kiếm</button>
          <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-200"><FaPlus />Thêm sản phẩm</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-100 text-green-700">
              <th className="p-2">Hình ảnh</th>
              <th className="p-2">Tên sản phẩm</th>
              <th className="p-2">Mã SP</th>
              <th className="p-2">Số lượng tồn</th>
              <th className="p-2">Vị trí</th>
              <th className="p-2">Giá nhập</th>
              <th className="p-2">Giá bán</th>
              <th className="p-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {/* Dữ liệu mẫu */}
            <tr className="border-b">
              <td className="p-2"><img src="/fruit-apple.png" alt="Táo" className="w-12 h-12 object-contain" /></td>
              <td className="p-2">Táo Fuji</td>
              <td className="p-2">SP001</td>
              <td className="p-2">120</td>
              <td className="p-2">Kệ A1</td>
              <td className="p-2">₫20,000</td>
              <td className="p-2">₫30,000</td>
              <td className="p-2"><button className="text-green-600 hover:underline">Chi tiết</button></td>
            </tr>
            <tr className="border-b">
              <td className="p-2"><img src="/fruit-banana.png" alt="Chuối" className="w-12 h-12 object-contain" /></td>
              <td className="p-2">Chuối</td>
              <td className="p-2">SP002</td>
              <td className="p-2">80</td>
              <td className="p-2">Kệ B2</td>
              <td className="p-2">₫10,000</td>
              <td className="p-2">₫15,000</td>
              <td className="p-2"><button className="text-green-600 hover:underline">Chi tiết</button></td>
            </tr>
            {/* ...Thêm dữ liệu mẫu khác nếu cần */}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default InventoryManagement; 