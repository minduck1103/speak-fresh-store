import React, { useState, useEffect } from "react";
import api from "../../services/api";

const STATUS = ["Chờ xác nhận", "Đang chuẩn bị", "Đang giao", "Đã giao", "Đã hủy"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/orders");
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

  // Cập nhật trạng thái đơn hàng
  const handleStatus = async (id, status) => {
    setUpdating(true);
    try {
      // Gọi API để cập nhật trạng thái đơn hàng
      await api.put(`/orders/${id}`, { orderStatus: status });
      
      // Cập nhật state local
      setOrders(os => os.map(o => o._id === id ? { ...o, orderStatus: status } : o));
      
      // Hiển thị thông báo thành công
      alert("Cập nhật trạng thái đơn hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại!");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">🧾 Quản lý đơn hàng</h1>
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
              {orders.map(o => (
                <tr key={o._id} className="border-b hover:bg-green-50">
                  <td className="py-2 px-3 font-semibold text-green-700">{o._id}</td>
                  <td className="py-2 px-3">{o.user?.name || o.user?.email || "Ẩn danh"}</td>
                  <td className="py-2 px-3">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</td>
                  <td className="py-2 px-3">
                    <select 
                      value={o.orderStatus} 
                      onChange={e => handleStatus(o._id, e.target.value)} 
                      className="rounded px-2 py-1 border-green-300"
                      disabled={updating}
                    >
                      {STATUS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-2 px-3">{o.totalPrice?.toLocaleString()}₫</td>
                  <td className="py-2 px-3">{o.shippingInfo?.address || o.address || ""}</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 font-bold" onClick={() => setSelected(o)}>Xem</button>
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
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative border-2 border-green-200">
            <button type="button" onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-3xl font-bold">×</button>
            <h2 className="text-xl font-bold text-green-700 mb-4 text-center">Chi tiết đơn hàng</h2>
            <div className="mb-2"><b>Mã đơn:</b> {selected._id}</div>
            <div className="mb-2"><b>Khách hàng:</b> {selected.user?.name || selected.user?.email || "Ẩn danh"}</div>
            <div className="mb-2"><b>Ngày đặt:</b> {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString() : ''}</div>
            <div className="mb-2"><b>Trạng thái:</b> {selected.orderStatus}</div>
            <div className="mb-2"><b>Tổng tiền:</b> {selected.totalPrice?.toLocaleString()}₫</div>
            <div className="mb-2"><b>Địa chỉ:</b> {selected.shippingInfo?.address || selected.address || ""}</div>
            <div className="mt-4 text-center">
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 font-bold" onClick={() => setSelected(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 