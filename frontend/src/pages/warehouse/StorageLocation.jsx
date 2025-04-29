import { FaWarehouse } from 'react-icons/fa';

const StorageLocation = () => (
  <section className="bg-white rounded-xl shadow p-6 mb-8">
    <h2 className="text-lg font-bold text-green-700 flex items-center gap-2 mb-4"><FaWarehouse /> Quản lý vị trí lưu trữ</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">Kệ A1: Táo Fuji (120)</div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">Kệ B2: Chuối (80)</div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">Kệ C3: (Trống)</div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">Kệ D4: (Trống)</div>
    </div>
  </section>
);

export default StorageLocation; 