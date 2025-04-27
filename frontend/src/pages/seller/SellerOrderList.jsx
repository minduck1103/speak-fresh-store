import React, { useState } from "react";
import api from "../../services/api";

const STATUS = ["Chờ xác nhận", "Đang chuẩn bị", "Đang giao", "Đã giao", "Đã hủy"];

const SellerOrderList = ({ orders = [] }) => {
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  // Lọc đơn hàng có ít nhất 1 sản phẩm brand = 'green'
  const greenOrders = orders.filter(order =>
    (order.orderItems || []).some(item => item.brand === 'green')
  );

  const handleStatus = async (id, status) => {
    setUpdating(true);
    try {
      await api.put(`/orders/${id}`, { orderStatus: status });
      setSuccessMsg("Cập nhật trạng thái thành công!");
      setSelected(s => ({ ...s, orderStatus: status }));
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch {
      setSuccessMsg("Không thể cập nhật trạng thái!");
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
      await api.delete(`/orders/${deleteTarget._id}`);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      setSuccessMsg("Đã xóa đơn hàng thành công!");
      setTimeout(() => window.location.reload(), 1200);
    } catch {
      setSuccessMsg("Không thể xóa đơn hàng!");
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2"><span role="img" aria-label="fruit">🍏</span> Quản lý đơn hàng</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg bg-white">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-3">Mã đơn</th>
              <th className="py-2 px-3">Khách hàng</th>
              <th className="py-2 px-3">Ngày đặt</th>
              <th className="py-2 px-3">Trạng thái</th>
              <th className="py-2 px-3">Tổng tiền</th>
              <th className="py-2 px-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {greenOrders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6 text-gray-400">Không có đơn hàng</td></tr>
            ) : (
              greenOrders.map((o, idx) => (
                <tr key={o._id || idx} className="border-t border-green-50">
                  <td className="py-2 px-3 font-semibold text-green-700">{typeof o._id === 'object' && o._id.$oid ? o._id.$oid : o._id}</td>
                  <td className="py-2 px-3">
                    {o.shippingInfo?.name || o.shippingInfo?.phoneNo || 'Ẩn danh'}<br/>
                    <span className="text-xs text-gray-500">{o.shippingInfo?.address}</span>
                  </td>
                  <td className="py-2 px-3">{o.createdAt?.slice(0,10)}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${o.orderStatus === 'Delivered' || o.orderStatus === 'Đã giao' ? 'bg-green-200 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.orderStatus || 'Đang xử lý'}</span>
                  </td>
                  <td className="py-2 px-3 text-green-600 font-bold">{o.totalPrice?.toLocaleString()}₫</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button onClick={() => setSelected(o)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors">Xem</button>
                    <button onClick={() => openDeleteModal(o)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors">Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal xem & cập nhật trạng thái đơn hàng */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border-2 border-green-200">
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-3xl font-bold">×</button>
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Chi tiết đơn hàng</h2>
            <div className="mb-3 flex flex-col md:flex-row md:justify-between gap-2">
              <div className="text-gray-700">Mã đơn: <span className="font-semibold text-green-700">{typeof selected._id === 'object' && selected._id.$oid ? selected._id.$oid : selected._id}</span></div>
              <div className="text-gray-700">Ngày đặt: <span className="font-semibold">{selected.createdAt?.slice(0,10)}</span></div>
            </div>
            <div className="mb-3 text-gray-700">Trạng thái: 
              <select value={selected.orderStatus} onChange={e => handleStatus(selected._id, e.target.value)} className="rounded px-2 py-1 border-green-300 ml-2" disabled={updating}>
                {STATUS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="mb-3 text-gray-700">Tổng tiền: <span className="font-bold text-2xl text-green-600">{selected.totalPrice?.toLocaleString()}₫</span></div>
            <div className="mb-3 text-gray-700">Thông tin khách hàng:</div>
            <div className="mb-4 bg-green-50 rounded-lg p-3 border border-green-100">
              <div><span className="font-semibold">Tên/SĐT:</span> {selected.shippingInfo?.name || selected.shippingInfo?.phoneNo}</div>
              <div><span className="font-semibold">SĐT:</span> {selected.shippingInfo?.phoneNo}</div>
              <div><span className="font-semibold">Địa chỉ:</span> {selected.shippingInfo?.address}, {selected.shippingInfo?.city}</div>
            </div>
            <div className="mb-2 text-gray-700 font-semibold">Sản phẩm:</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-green-100 rounded-lg mb-4">
                <thead className="bg-green-100">
                  <tr>
                    <th className="py-2 px-2">Ảnh</th>
                    <th className="py-2 px-2">Tên</th>
                    <th className="py-2 px-2">SL</th>
                    <th className="py-2 px-2">Giá</th>
                    <th className="py-2 px-2">Tổng phụ</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.orderItems || []).map((item, idx) => (
                    <tr key={idx} className="border-t border-green-50">
                      <td className="py-2 px-2"><img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" /></td>
                      <td className="py-2 px-2 font-semibold text-green-700">{item.name}</td>
                      <td className="py-2 px-2 text-center">{item.quantity}</td>
                      <td className="py-2 px-2">{item.price?.toLocaleString()}₫</td>
                      <td className="py-2 px-2 font-bold">{(item.price * item.quantity).toLocaleString()}₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {successMsg && <div className="text-green-600 text-center font-bold my-2">{successMsg}</div>}
            <button onClick={() => setSelected(null)} className="w-full mt-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg">Đóng</button>
          </div>
        </div>
      )}
      {/* Modal xác nhận xóa đơn hàng */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center border-2 border-red-200">
            <button type="button" onClick={() => setShowDeleteModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-600 text-3xl font-bold">×</button>
            <h2 className="text-xl font-bold text-red-700 mb-4">Xác nhận xóa đơn hàng</h2>
            <p className="mb-6">Bạn có chắc chắn muốn xóa đơn hàng <span className="font-bold">{deleteTarget._id}</span> không?</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 font-bold">Hủy</button>
              <button onClick={handleDeleteOrder} className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 font-bold">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerOrderList; 