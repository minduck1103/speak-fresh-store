import React, { useState } from "react";

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'Đang xử lý', label: 'Đang xử lý' },
  { value: 'Đang giao', label: 'Đang giao' },
  { value: 'Đã giao', label: 'Đã giao' },
  { value: 'Đã hủy', label: 'Đã hủy' },
];

const DeliveryOrderList = ({ orders = [], onUpdateStatus }) => {
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2"><span role="img" aria-label="fruit">🍊</span> Quản lý đơn hàng</h2>
      <div className="flex items-center gap-3 mb-4">
        <label className="font-semibold text-green-700">Lọc theo trạng thái:</label>
        <select
          className="border border-green-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
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
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6 text-gray-400">Không có đơn hàng</td></tr>
            ) : (
              filteredOrders.map((o, idx) => (
                <tr key={o._id || idx} className="border-t border-green-50">
                  <td className="py-2 px-3 font-semibold text-green-700">{o._id}</td>
                  <td className="py-2 px-3">{o.customer?.name || 'Ẩn danh'}</td>
                  <td className="py-2 px-3">{o.createdAt?.slice(0,10)}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'Đã giao' ? 'bg-green-200 text-green-700' : o.status === 'Đang giao' ? 'bg-blue-100 text-blue-700' : o.status === 'Đã hủy' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>{o.status || 'Đang xử lý'}</span>
                  </td>
                  <td className="py-2 px-3 text-green-600 font-bold">{o.totalPrice?.toLocaleString()}₫</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button onClick={() => setSelected(o)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors">Xem</button>
                    <button onClick={() => onUpdateStatus(o)} className="bg-yellow-400 text-green-900 px-3 py-1 rounded hover:bg-yellow-500 transition-colors font-bold">Cập nhật trạng thái</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border-2 border-green-200">
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-3xl font-bold">×</button>
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Chi tiết đơn hàng</h2>
            <div className="mb-3 flex flex-col md:flex-row md:justify-between gap-2">
              <div className="text-gray-700">Mã đơn: <span className="font-semibold text-green-700">{selected._id}</span></div>
              <div className="text-gray-700">Ngày đặt: <span className="font-semibold">{selected.createdAt?.slice(0,10)}</span></div>
            </div>
            <div className="mb-3 text-gray-700">Trạng thái: <span className={`font-bold px-2 py-1 rounded ${selected.status === 'Đã giao' ? 'bg-green-200 text-green-700' : selected.status === 'Đang giao' ? 'bg-blue-100 text-blue-700' : selected.status === 'Đã hủy' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>{selected.status || 'Đang xử lý'}</span></div>
            <div className="mb-3 text-gray-700">Tổng tiền: <span className="font-bold text-2xl text-green-600">{selected.totalPrice?.toLocaleString()}₫</span></div>
            <div className="mb-3 text-gray-700">Thông tin khách hàng:</div>
            <div className="mb-4 bg-green-50 rounded-lg p-3 border border-green-100">
              <div><span className="font-semibold">Tên:</span> {selected.customer?.name}</div>
              <div><span className="font-semibold">SĐT:</span> {selected.customer?.phoneNo}</div>
              <div><span className="font-semibold">Địa chỉ:</span> {selected.customer?.address}, {selected.customer?.city}</div>
            </div>
            <div className="mb-2 text-gray-700 font-semibold">Sản phẩm:</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-green-100 rounded-lg mb-4">
                <thead className="bg-green-100">
                  <tr>
                    <th className="py-2 px-2">Tên</th>
                    <th className="py-2 px-2">SL</th>
                    <th className="py-2 px-2">Giá</th>
                    <th className="py-2 px-2">Tổng phụ</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.items || []).map((item, idx) => (
                    <tr key={idx} className="border-t border-green-50">
                      <td className="py-2 px-2 font-semibold text-green-700">{item.name}</td>
                      <td className="py-2 px-2 text-center">{item.quantity}</td>
                      <td className="py-2 px-2">{item.price?.toLocaleString()}₫</td>
                      <td className="py-2 px-2 font-bold">{(item.price * item.quantity).toLocaleString()}₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setSelected(null)} className="w-full mt-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg">Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryOrderList; 