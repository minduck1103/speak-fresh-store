import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaFileAlt, FaPlus } from 'react-icons/fa';

const LOCATIONS = ['A1', 'B2', 'C3', 'D4', 'E5'];

const ImportExportManagement = () => {
  const [tab, setTab] = useState('import');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const fetchOrders = () => {
    api.get('/api/v1/orders').then(res => {
      let data = Array.isArray(res.data) ? res.data : res.data.data || [];
      data = data.map(order => ({ ...order, location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)] }));
      setOrders(data);
    });
  };
  useEffect(() => { fetchOrders(); }, []);

  const handleImport = async (order) => {
    await api.put(`/api/v1/orders/${order._id}`, { status: 'Imported' });
    fetchOrders();
  };
  const handleExport = async (order) => {
    await api.put(`/api/v1/orders/${order._id}`, { status: 'Exported' });
    fetchOrders();
  };
  const handleDetail = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };
  return (
    <section className="mb-8">
      <div className="flex gap-4 mb-4">
        <button className={`px-4 py-2 rounded-t-lg font-bold ${tab==='import'?'bg-green-600 text-white':'bg-green-100 text-green-700'}`} onClick={()=>setTab('import')}>Import Management</button>
        <button className={`px-4 py-2 rounded-t-lg font-bold ${tab==='export'?'bg-green-600 text-white':'bg-green-100 text-green-700'}`} onClick={()=>setTab('export')}>Export Management</button>
      </div>
      {tab==='import' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-green-700 mb-4">Orders in transit</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-100 text-green-700">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.filter(o=>o.status==='delivering').map(order=>(
                  <tr key={order._id} className="border-b">
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{order.location}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2 flex gap-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={()=>handleImport(order)}>Confirm Import</button>
                      <button className="text-green-600 hover:underline" onClick={()=>handleDetail(order)}>Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {tab==='export' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-green-700 mb-4">Orders in transit</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-100 text-green-700">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.filter(o=>o.status==='Đã nhập kho').map(order=>(
                  <tr key={order._id} className="border-b">
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{order.location}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2 flex gap-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={()=>handleExport(order)}>Confirm Export</button>
                      <button className="text-green-600 hover:underline" onClick={()=>handleDetail(order)}>Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Modal chi tiết đơn hàng */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-green-700" onClick={() => setModalOpen(false)}>Close</button>
            <h3 className="text-xl font-bold mb-4 text-green-700">Order Detail</h3>
            <pre className="bg-green-50 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(selectedOrder, null, 2)}</pre>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImportExportManagement; 