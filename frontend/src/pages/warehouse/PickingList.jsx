import { FaFileAlt } from 'react-icons/fa';

const PickingList = () => (
  <section className="bg-white rounded-xl shadow p-6 mb-8">
    <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2"><FaFileAlt /> Pick List & Confirm Export</h2>
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <h3 className="font-semibold text-green-700 mb-2">List of products to pick</h3>
        <ul className="list-disc pl-6 text-green-800">
          <li>Apple - A1 - 10</li>
          <li>Banana - B2 - 5</li>
        </ul>
      </div>
      <div className="flex-1 flex items-end">
        <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 w-full">Confirm Export</button>
      </div>
    </div>
  </section>
);

export default PickingList; 