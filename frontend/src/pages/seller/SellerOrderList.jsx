import { useState } from "react";
import api from "../../services/api";
import PropTypes from 'prop-types';

const SellerOrderList = ({ orders = [], confirmMode = false, onReloadOrders }) => {
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Hiển thị toàn bộ orders truyền vào (đã được lọc status ở SellerPage.jsx)
  const displayOrders = Array.isArray(orders) ? orders : [];

  console.log('DEBUG orders:', orders);
  console.log('DEBUG displayOrders:', displayOrders);

  const handleConfirm = async (id) => {
    setUpdating(true);
    try {
      // Tìm đơn hàng cần xác nhận
      const orderToConfirm = orders.find(order => order._id === id);
      if (!orderToConfirm) {
        throw new Error('Order not found');
      }

      // Debug log
      console.log('Order to confirm:', orderToConfirm);
      
      // Tính toán totalAmount
      const totalAmount = orderToConfirm.totalAmount || 
                         orderToConfirm.totalPrice || 
                         (orderToConfirm.itemsPrice + orderToConfirm.shippingPrice + orderToConfirm.taxPrice);

      console.log('Calculated totalAmount:', totalAmount);

      // Gửi request với totalAmount
      const response = await api.put(`/api/v1/orders/${id}/confirm`, {
        totalAmount: totalAmount,
        status: "accepted"  // Add new status
      });
      
      console.log('Confirm response:', response);
      
      setSuccessMsg("Order confirmed!");
      if (onReloadOrders) onReloadOrders();
    } catch (error) {
      console.error('Error confirming order:', error);
      setSuccessMsg(error.response?.data?.error || "Cannot confirm order!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async (id) => {
    setUpdating(true);
    try {
      await api.put(`/api/v1/orders/${id}/reject`);
      setSuccessMsg("Order rejected!");
      if (onReloadOrders) onReloadOrders();
    } catch {
      setSuccessMsg("Cannot reject order!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } finally {
      setUpdating(false);
    }
  };

  const openDeleteModal = (order) => {
    setDeleteTarget(order);
    setShowDeleteModal(true);
  };

  const handleDeleteOrder = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/v1/orders/${deleteTarget._id}`);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setSuccessMsg("Order deleted successfully!");
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      setSuccessMsg("Cannot delete order!");
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg bg-white">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3">Order Date</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Total Amount</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6 text-gray-400">No orders</td></tr>
            ) : (
              displayOrders.map((o, idx) => {
                console.log('DEBUG order row:', o);
                return (
                  <tr key={o._id || idx} className="border-t border-green-50">
                    <td className="py-2 px-3 font-semibold text-green-700">{typeof o._id === 'object' && o._id.$oid ? o._id.$oid : o._id}</td>
                    <td className="py-2 px-3">
                      {o.shippingInfo?.name || o.shippingInfo?.phoneNo || 'Ẩn danh'}<br/>
                      <span className="text-xs text-gray-500">{o.shippingInfo?.address}</span>
                    </td>
                    <td className="py-2 px-3">{o.createdAt?.slice(0,10)}</td>
                    <td className="py-2 px-3">
                      <span className="font-bold px-2 py-1 rounded bg-green-100 text-green-700">
                        {o.status || o.orderStatus}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-green-600 font-bold">
                      {(o.totalAmount || o.totalPrice || 0).toLocaleString()}₫
                    </td>
                    <td className="py-2 px-3 flex gap-2">
                      {confirmMode ? (
                        <>
                          <button onClick={() => handleConfirm(o._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors" disabled={updating}>Confirm</button>
                          <button onClick={() => handleReject(o._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors" disabled={updating}>Reject</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => setSelected(o)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors">View</button>
                          <button onClick={() => openDeleteModal(o)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {/* Modal xem chi tiết đơn hàng */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border-2 border-green-200">
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-3xl font-bold">×</button>
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Order Details</h2>
            <div className="mb-3 flex flex-col md:flex-row md:justify-between gap-2">
              <div className="text-gray-700">Order ID: <span className="font-semibold text-green-700">{typeof selected._id === 'object' && selected._id.$oid ? selected._id.$oid : selected._id}</span></div>
              <div className="text-gray-700">Order Date: <span className="font-semibold">{selected.createdAt?.slice(0,10)}</span></div>
            </div>
            <div className="mb-3 text-gray-700">Status: <span className="font-bold px-2 py-1 rounded bg-green-100 text-green-700">{selected.status || selected.orderStatus}</span></div>
            <div className="mb-3 text-gray-700">Total Amount: <span className="font-bold text-2xl text-green-600">{(selected.totalAmount || selected.totalPrice || 0).toLocaleString()}₫</span></div>
            <div className="mb-3 text-gray-700">Customer Information:</div>
            <div className="mb-4 bg-green-50 rounded-lg p-3 border border-green-100">
              <div><span className="font-semibold">Name/Phone:</span> {selected.shippingInfo?.name || selected.shippingInfo?.phoneNo}</div>
              <div><span className="font-semibold">Phone:</span> {selected.shippingInfo?.phoneNo}</div>
              <div><span className="font-semibold">Address:</span> {selected.shippingInfo?.address}, {selected.shippingInfo?.city}</div>
            </div>
            <div className="mb-2 text-gray-700 font-semibold">Products:</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-green-100 rounded-lg mb-4">
                <thead className="bg-green-100">
                  <tr>
                    <th className="py-2 px-2">Image</th>
                    <th className="py-2 px-2">Name</th>
                    <th className="py-2 px-2">Quantity</th>
                    <th className="py-2 px-2">Price</th>
                    <th className="py-2 px-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(Array.isArray(selected?.items) && selected.items.length > 0 ? selected.items : selected.orderItems || []).map((item, idx) => (
                    <tr key={idx} className="border-t border-green-50">
                      <td className="py-2 px-2"><img src={item.image || item.product?.image} alt={item.name || item.product?.name} className="w-12 h-12 object-cover rounded" /></td>
                      <td className="py-2 px-2 font-semibold text-green-700">{item.name || item.product?.name}</td>
                      <td className="py-2 px-2 text-center">{item.qty || item.quantity || 1}</td>
                      <td className="py-2 px-2">{(item.price || item.product?.price)?.toLocaleString()}₫</td>
                      <td className="py-2 px-2 font-bold">{((item.price || item.product?.price) * (item.qty || item.quantity || 1)).toLocaleString()}₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {successMsg && <div className="text-green-600 text-center font-bold my-2">{successMsg}</div>}
            <button onClick={() => setSelected(null)} className="w-full mt-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg">Close</button>
          </div>
        </div>
      )}
      {/* Modal xác nhận xóa đơn hàng */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center border-2 border-red-200">
            <button type="button" onClick={() => setShowDeleteModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-3xl font-bold">×</button>
            <h2 className="text-xl font-bold text-red-700 mb-4">Confirm Delete Order</h2>
            <p className="mb-6">Are you sure you want to delete the order <span className="font-bold">{deleteTarget._id}</span>?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 font-bold">Cancel</button>
              <button onClick={handleDeleteOrder} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 font-bold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SellerOrderList.propTypes = {
  orders: PropTypes.array,
  confirmMode: PropTypes.bool,
  onReloadOrders: PropTypes.func
};

export default SellerOrderList; 