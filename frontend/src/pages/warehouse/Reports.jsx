import { useState } from 'react';
import html2pdf from 'html2pdf.js';
import { FaChartBar } from 'react-icons/fa';

const mockReport = {
  stock: { quantity: 1200, value: 1200000, outOfStock: 2, oldStock: 5 },
  importExport: { import: 300, export: 250, supplier: 3, customer: 4 },
  inventory: { diff: 2, last: '2024-05-30' }
};

const ExportReportModal = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-700">Warehouse Report</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>
      <div id="warehouse-report-pdf-content" className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-green-700 mb-4">Stock report</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Quantity</div>
              <div className="text-2xl font-bold text-green-700">{mockReport.stock.quantity}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Value</div>
              <div className="text-2xl font-bold text-green-700">{mockReport.stock.value.toLocaleString()}₫</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Out of stock</div>
              <div className="text-2xl font-bold text-green-700">{mockReport.stock.outOfStock}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Stock is old</div>
              <div className="text-2xl font-bold text-green-700">{mockReport.stock.oldStock}</div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-green-700 mb-4">Import/Export report</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Import</div>
              <div className="text-2xl font-bold text-green-700">{mockReport.importExport.import}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Export</div>
              <div className="text-2xl font-bold text-green-700">{mockReport.importExport.export}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Supplier</div>
              <div className="text-2xl font-bold text-green-700">{mockReport.importExport.supplier}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Customer</div>
              <div className="text-2xl font-bold text-green-700">{mockReport.importExport.customer}</div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-green-700 mb-4">Inventory report</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Inventory difference</div>
              <div className="text-2xl font-bold text-green-700">{mockReport.inventory.diff}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Last inventory</div>
              <div className="text-2xl font-bold text-green-700">{mockReport.inventory.last}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-2">
        <button onClick={() => window.print()} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          🖨️ Print Report
        </button>
        <button
          onClick={() => {
            const el = document.getElementById('warehouse-report-pdf-content');
            html2pdf().from(el).save('warehouse-report.pdf');
          }}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          🖨️ Export PDF
        </button>
      </div>
    </div>
  </div>
);

const Reports = () => {
  const [showExport, setShowExport] = useState(false);
  return (
    <section className="bg-white rounded-xl shadow p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-green-700 flex items-center gap-2"><FaChartBar /> Reports & Statistics</h2>
        <button
          onClick={() => setShowExport(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          📊 Export Report
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-700 mb-2">Stock report</h3>
          <p className="text-green-800">Quantity: 1200<br />Value: ₫1,200,000<br />Out of stock: 2<br />Stock is old: 5</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-700 mb-2">Import/export report</h3>
          <p className="text-green-800">Import: 300<br />Export: 250<br />Supplier: 3<br />Customer: 4</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-700 mb-2">Inventory report</h3>
          <p className="text-green-800">Inventory difference: 2<br />Last inventory: 2024-05-30</p>
        </div>
      </div>
      {showExport && <ExportReportModal onClose={() => setShowExport(false)} />}
    </section>
  );
};

export default Reports; 