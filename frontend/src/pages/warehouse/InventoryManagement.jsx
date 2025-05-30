import { useState, useEffect } from 'react';
import api from '../../services/api';

const LOCATIONS = ['A1', 'B2', 'C3', 'D4', 'E5'];

const InventoryManagement = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    api.get('/api/v1/orders').then(res => {
      let data = Array.isArray(res.data) ? res.data : res.data.data || [];
      // Gán vị trí random cho mỗi đơn hàng
      data = data.map(order => ({ ...order, location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)] }));
      setOrders(data);
    });
  }, []);

  const handleDetail = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  return (
    <section className="bg-white rounded-xl shadow p-6 mb-8">
      <h2 className="text-lg font-bold text-green-700 mb-4">List of orders in warehouse</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-green-100 text-green-700">
              <th className="p-2">Order ID</th>
              <th className="p-2">Location</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.filter(order => order.status === 'In transit').map(order => (
              <tr key={order._id} className="border-b">
                <td className="p-2">{order._id}</td>
                <td className="p-2">{order.location}</td>
                <td className="p-2">
                  <button className="text-green-600 hover:underline" onClick={() => handleDetail(order)}>Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal chi tiết đơn hàng */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
            <button className="absolute top-2 right-2 text-green-700" onClick={() => setModalOpen(false)}>Close</button>
            <h3 className="text-xl font-bold mb-4 text-green-700">Order Detail</h3>
            <div className="mb-2"><b>Order ID:</b> {selectedOrder._id}</div>
            <div className="mb-2"><b>Status:</b> {selectedOrder.status}</div>
            <div className="mb-2"><b>Created At:</b> {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : ''}</div>
            <div className="mb-2"><b>Location:</b> {selectedOrder.location}</div>
            <div className="mb-2"><b>List of products:</b></div>
            <ul className="mb-2 pl-4 list-disc">
              {selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items.map((item, idx) => (
                <li key={idx}>
                  {item.product && item.product.name ? item.product.name : 'Product'}
                  {item.qty ? ` - Quantity: ${item.qty}` : ''}
                  {item.price ? ` - Price: ${item.price.toLocaleString()}₫` : ''}
                </li>
              )) : <li>No products</li>}
            </ul>
            {selectedOrder.shippingInfo && (
              <div className="mb-2"><b>Shipping info:</b> {selectedOrder.shippingInfo.name} - {selectedOrder.shippingInfo.phone} - {selectedOrder.shippingInfo.address}</div>
            )}
            {selectedOrder.user && (
              <div className="mb-2"><b>User:</b> {selectedOrder.user}</div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default InventoryManagement; 