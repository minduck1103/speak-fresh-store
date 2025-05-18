import { useState, useEffect } from 'react';
import api from '../../services/api';
import { FaFileAlt, FaPlus } from 'react-icons/fa';

const LOCATIONS = ['Kệ A1', 'Kệ B2', 'Kệ C3', 'Kệ D4', 'Kệ E5'];

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
    await api.put(`/api/v1/orders/${order._id}`, { status: 'Đã nhập kho' });
    fetchOrders();
  };
  const handleExport = async (order) => {
    await api.put(`/api/v1/orders/${order._id}`, { status: 'Đã xuất kho' });
    fetchOrders();
  };
  const handleDetail = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };
  return (
    <section className="mb-8">
      <div className="flex gap-4 mb-4">
        <button className={`px-4 py-2 rounded-t-lg font-bold ${tab==='import'?'bg-green-600 text-white':'bg-green-100 text-green-700'}`} onClick={()=>setTab('import')}>Quản lý nhập kho</button>
        <button className={`px-4 py-2 rounded-t-lg font-bold ${tab==='export'?'bg-green-600 text-white':'bg-green-100 text-green-700'}`} onClick={()=>setTab('export')}>Quản lý xuất kho</button>
      </div>
      {tab==='import' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-green-700 mb-4">Đơn hàng đang vận chuyển</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-100 text-green-700">
                  <th className="p-2">Mã đơn hàng</th>
                  <th className="p-2">Vị trí</th>
                  <th className="p-2">Trạng thái</th>
                  <th className="p-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.filter(o=>o.status==='Đang giao').map(order=>(
                  <tr key={order._id} className="border-b">
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{order.location}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2 flex gap-2">
                      <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" onClick={()=>handleImport(order)}>Xác nhận nhập kho</button>
                      <button className="text-green-600 hover:underline" onClick={()=>handleDetail(order)}>Chi tiết</button>
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
          <h2 className="text-lg font-bold text-green-700 mb-4">Đơn hàng đã nhập kho</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-green-100 text-green-700">
                  <th className="p-2">Mã đơn hàng</th>
                  <th className="p-2">Vị trí</th>
                  <th className="p-2">Trạng thái</th>
                  <th className="p-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.filter(o=>o.status==='Đã nhập kho').map(order=>(
                  <tr key={order._id} className="border-b">
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{order.location}</td>
                    <td className="p-2">{order.status}</td>
                    <td className="p-2 flex gap-2">
                      <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" onClick={()=>handleExport(order)}>Xác nhận xuất kho</button>
                      <button className="text-green-600 hover:underline" onClick={()=>handleDetail(order)}>Chi tiết</button>
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
            <button className="absolute top-2 right-2 text-green-700" onClick={() => setModalOpen(false)}>Đóng</button>
            <h3 className="text-xl font-bold mb-4 text-green-700">Chi tiết đơn hàng</h3>
            <pre className="bg-green-50 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(selectedOrder, null, 2)}</pre>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImportExportManagement; 