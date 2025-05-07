import { useState, useEffect } from "react";
import api from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchOrder, setSearchOrder] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/orders");
      let data = res.data;
      if (Array.isArray(data)) setOrders(data);
      else if (data && Array.isArray(data.data)) setOrders(data.data);
      else setOrders([]);
    } catch {
      setError("Không thể tải đơn hàng");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/v1/orders/${deleteTarget._id}`);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchOrders();
    } catch {
      alert('Không thể xóa đơn hàng!');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">🧾 Quản lý đơn hàng</h1>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={searchOrder}
          onChange={e => setSearchOrder(e.target.value)}
          className="border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
        />
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        {loading ? (
          <div className="text-center py-10">Đang tải đơn hàng...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-green-100">
                <th className="py-2 px-3">Mã đơn</th>
                <th className="py-2 px-3">Khách hàng</th>
                <th className="py-2 px-3">Ngày đặt</th>
                <th className="py-2 px-3">Trạng thái</th>
                <th className="py-2 px-3">Tổng tiền</th>
                <th className="py-2 px-3">Địa chỉ</th>
                <th className="py-2 px-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter(o =>
                o._id.toLowerCase().includes(searchOrder.toLowerCase()) ||
                (o.user?.name && o.user.name.toLowerCase().includes(searchOrder.toLowerCase())) ||
                (o.user?.email && o.user.email.toLowerCase().includes(searchOrder.toLowerCase()))
              ).map(o => (
                <tr key={o._id} className="border-b hover:bg-green-50">
                  <td className="py-2 px-3 font-semibold text-green-700">{o._id}</td>
                  <td className="py-2 px-3">{o.user?.name || o.user?.email || "Ẩn danh"}</td>
                  <td className="py-2 px-3">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      (o.status || o.orderStatus) === 'Đã giao' ? 'bg-green-200 text-green-700' :
                      (o.status || o.orderStatus) === 'Đang giao' ? 'bg-blue-100 text-blue-700' :
                      (o.status || o.orderStatus) === 'Đã hủy' ? 'bg-red-100 text-red-600' :
                      (o.status || o.orderStatus) === 'Không thành công' ? 'bg-gray-200 text-gray-700' :
                      (o.status || o.orderStatus) === 'Đã từ chối' ? 'bg-red-200 text-red-700' :
                      (o.status || o.orderStatus) === 'Chờ lấy hàng' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {o.status || o.orderStatus}
                    </span>
                  </td>
                  <td className="py-2 px-3">{o.totalAmount?.toLocaleString()}₫</td>
                  <td className="py-2 px-3">{o.shippingInfo?.address || o.address || ""}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 font-bold" onClick={() => setSelected(o)}>Xem</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold" onClick={() => { setDeleteTarget(o); setShowDeleteModal(true); }}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Modal xem chi tiết */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative border-2 border-green-200">
            <button type="button" onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-3xl font-bold">×</button>
            <h2 className="text-xl font-bold text-green-700 mb-4 text-center">Chi tiết đơn hàng</h2>
            <div className="mb-2"><b>Mã đơn:</b> {selected._id}</div>
            <div className="mb-2"><b>Khách hàng:</b> {selected.user?.name || selected.user?.email || "Ẩn danh"}</div>
            <div className="mb-2"><b>Ngày đặt:</b> {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : ''}</div>
            <div className="mb-2"><b>Trạng thái:</b> <span className={`font-bold px-2 py-1 rounded ${
              (selected.status || selected.orderStatus) === 'Đã giao' ? 'bg-green-200 text-green-700' :
              (selected.status || selected.orderStatus) === 'Đang giao' ? 'bg-blue-100 text-blue-700' :
              (selected.status || selected.orderStatus) === 'Đã hủy' ? 'bg-red-100 text-red-600' :
              (selected.status || selected.orderStatus) === 'Không thành công' ? 'bg-gray-200 text-gray-700' :
              (selected.status || selected.orderStatus) === 'Đã từ chối' ? 'bg-red-200 text-red-700' :
              (selected.status || selected.orderStatus) === 'Chờ lấy hàng' ? 'bg-yellow-100 text-yellow-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>{selected.status || selected.orderStatus}</span></div>
            <div className="mb-2"><b>Tổng tiền:</b> {selected.totalAmount?.toLocaleString()}₫</div>
            <div className="mb-2"><b>Địa chỉ:</b> {selected.shippingInfo?.address || selected.address || ""}</div>
            <div className="mb-4"><b>Số điện thoại:</b> {selected.shippingInfo?.phone || ''}</div>
            <div className="mb-4"><b>Email:</b> {selected.user?.email || ''}</div>
            <div className="mb-4"><b>Ghi chú:</b> {selected.note || ''}</div>
            <div className="mb-4"><b>Danh sách sản phẩm:</b></div>
            <div className="overflow-x-auto mb-4">
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
                  {(selected.items || []).map((item, idx) => (
                    <tr key={idx} className="border-t border-green-50">
                      <td className="py-2 px-2"><img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" /></td>
                      <td className="py-2 px-2 font-semibold text-green-700">{item.name}</td>
                      <td className="py-2 px-2 text-center">{item.qty}</td>
                      <td className="py-2 px-2">{item.price?.toLocaleString()}₫</td>
                      <td className="py-2 px-2 font-bold">{(item.price * item.qty).toLocaleString()}₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 font-bold" onClick={() => setSelected(null)}>Đóng</button>
            </div>
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

export default AdminOrders; 