import { FaWarehouse } from 'react-icons/fa';

const StorageLocation = () => (
  <section className="bg-white rounded-xl shadow p-6 mb-8">
    <h2 className="text-lg font-bold text-green-700 flex items-center gap-2 mb-4"><FaWarehouse /> Storage location management</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">A1: Apple (120)</div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">B2: Banana (80)</div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">C3: (Empty)</div>
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">D4: (Empty)</div>
    </div>
  </section>
);

export default StorageLocation; 