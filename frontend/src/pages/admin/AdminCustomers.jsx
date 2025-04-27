import React, { useState, useEffect } from "react";
import api from "../../services/api";

const ROLES = [
  { value: "all", label: "Tất cả" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
  { value: "seller", label: "Seller" },
  { value: "delivery", label: "Delivery" },
];

const ROLE_COLORS = {
  admin: "bg-blue-100 text-blue-700",
  user: "bg-green-100 text-green-700",
  seller: "bg-yellow-100 text-yellow-700",
  delivery: "bg-purple-100 text-purple-700"
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "user" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState("all");
  const [viewData, setViewData] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/users");
      let users = response.data;
      if (users && typeof users === 'object') {
        if (Array.isArray(users.data)) {
          users = users.data;
        } else if (Array.isArray(users.users)) {
          users = users.users;
        } else if (Array.isArray(users.results)) {
          users = users.results;
        }
      }
      setCustomers(Array.isArray(users) ? users : []);
    } catch (err) {
      setError("Không thể tải danh sách khách hàng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Xem lịch sử động theo role
  const openViewModal = async (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
    setViewData([]);
    setViewError("");
    setViewLoading(true);
    try {
      if (user.role === "user") {
        // Lấy lịch sử đơn hàng của user
        const res = await api.get(`/orders?user=${user._id}`);
        setViewData(res.data.data || res.data || []);
      } else if (user.role === "seller") {
        // Lấy lịch sử sản phẩm đã đăng bán
        const res = await api.get(`/products?seller=${user._id}`);
        setViewData(res.data.data || res.data || []);
      } else if (user.role === "delivery") {
        // Lấy lịch sử đơn hàng đã tiếp nhận/hoàn thành
        const res = await api.get(`/orders?delivery=${user._id}`);
        setViewData(res.data.data || res.data || []);
      } else if (user.role === "admin") {
        // Giả lập lịch sử truy cập
        setViewData([
          { time: "2024-04-27 10:00", action: "Đăng nhập hệ thống" },
          { time: "2024-04-27 10:05", action: "Xem dashboard quản trị" },
          { time: "2024-04-27 10:10", action: "Quản lý người dùng" }
        ]);
      }
    } catch (err) {
      setViewError("Không thể tải dữ liệu lịch sử.");
    } finally {
      setViewLoading(false);
    }
  };
  const closeViewModal = () => {
    setShowViewModal(false);
    setSelectedUser(null);
    setViewData([]);
    setViewError("");
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedUser(null);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await api.put(`/users/${selectedUser._id}`, editForm);
      await fetchCustomers();
      closeEditModal();
    } catch (err) {
      alert("Lưu thay đổi thất bại!");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/users/${selectedUser._id}`);
      await fetchCustomers();
      closeDeleteModal();
    } catch (err) {
      alert("Xóa người dùng thất bại!");
    } finally {
      setDeleting(false);
    }
  };

  // Lọc khách hàng theo role
  const filteredCustomers = activeRoleTab === "all"
    ? customers
    : customers.filter(c => c.role === activeRoleTab);

  if (loading) return <div className="text-center py-10">Đang tải khách hàng...</div>;
  if (error) return (
    <div className="text-center py-10">
      <div className="text-red-600 font-bold mb-2">⚠️ {error}</div>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Thử lại
      </button>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">👤 Quản lý khách hàng</h1>
      {/* Tab section switch */}
      <div className="flex gap-2 mb-4">
        {ROLES.map(r => (
          <button
            key={r.value}
            onClick={() => setActiveRoleTab(r.value)}
            className={`px-4 py-2 rounded-full font-bold border-2 transition-colors ${activeRoleTab === r.value ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}
          >
            {r.label}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="w-full text-left border border-green-100 rounded-xl">
          <thead>
            <tr className="bg-green-100 text-green-800">
              <th className="py-2 px-3">Tên</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Vai trò</th>
              <th className="py-2 px-3">Ngày tạo</th>
              <th className="py-2 px-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c._id} className="border-b hover:bg-green-50 transition">
                <td className="py-2 px-3 font-semibold text-green-700">{c.name}</td>
                <td className="py-2 px-3">{c.email}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${ROLE_COLORS[c.role] || 'bg-gray-100 text-gray-700'}`}>{c.role.charAt(0).toUpperCase() + c.role.slice(1)}</span>
                </td>
                <td className="py-2 px-3">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}</td>
                <td className="py-2 px-3 text-center flex gap-2 justify-center">
                  <button onClick={() => openViewModal(c)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow text-xs">Xem</button>
                  <button onClick={() => openEditModal(c)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow text-xs">Chỉnh sửa</button>
                  <button onClick={() => openDeleteModal(c)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow text-xs">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Xem lịch sử động */}
      {showViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-green-700">{selectedUser?.role === 'user' && 'Lịch sử đơn hàng'}{selectedUser?.role === 'seller' && 'Lịch sử đăng bán'}{selectedUser?.role === 'delivery' && 'Lịch sử giao hàng'}{selectedUser?.role === 'admin' && 'Lịch sử truy cập'}</h2>
            {viewLoading ? (
              <div className="text-center py-6">Đang tải dữ liệu...</div>
            ) : viewError ? (
              <div className="text-center text-red-500 py-6">{viewError}</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {selectedUser?.role === 'user' && (
                  <table className="w-full text-left mb-2">
                    <thead><tr><th className="py-1 px-2">Mã đơn</th><th className="py-1 px-2">Ngày</th><th className="py-1 px-2">Tổng tiền</th><th className="py-1 px-2">Trạng thái</th></tr></thead>
                    <tbody>
                      {viewData.length === 0 ? <tr><td colSpan={4} className="text-center text-gray-400">Không có đơn hàng</td></tr> : viewData.map(o => (
                        <tr key={o._id}><td className="py-1 px-2">{o._id}</td><td className="py-1 px-2">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</td><td className="py-1 px-2">{o.totalPrice?.toLocaleString()}₫</td><td className="py-1 px-2">{o.orderStatus}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {selectedUser?.role === 'seller' && (
                  <table className="w-full text-left mb-2">
                    <thead><tr><th className="py-1 px-2">Tên sản phẩm</th><th className="py-1 px-2">Giá</th><th className="py-1 px-2">Kho</th></tr></thead>
                    <tbody>
                      {viewData.length === 0 ? <tr><td colSpan={3} className="text-center text-gray-400">Không có sản phẩm</td></tr> : viewData.map(p => (
                        <tr key={p._id}><td className="py-1 px-2">{p.name}</td><td className="py-1 px-2">{p.price?.toLocaleString()}₫</td><td className="py-1 px-2">{p.stock}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {selectedUser?.role === 'delivery' && (
                  <table className="w-full text-left mb-2">
                    <thead><tr><th className="py-1 px-2">Mã đơn</th><th className="py-1 px-2">Ngày</th><th className="py-1 px-2">Tổng tiền</th><th className="py-1 px-2">Trạng thái</th></tr></thead>
                    <tbody>
                      {viewData.length === 0 ? <tr><td colSpan={4} className="text-center text-gray-400">Không có đơn hàng</td></tr> : viewData.map(o => (
                        <tr key={o._id}><td className="py-1 px-2">{o._id}</td><td className="py-1 px-2">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</td><td className="py-1 px-2">{o.totalPrice?.toLocaleString()}₫</td><td className="py-1 px-2">{o.orderStatus}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {selectedUser?.role === 'admin' && (
                  <table className="w-full text-left mb-2">
                    <thead><tr><th className="py-1 px-2">Thời gian</th><th className="py-1 px-2">Hành động</th></tr></thead>
                    <tbody>
                      {viewData.length === 0 ? <tr><td colSpan={2} className="text-center text-gray-400">Không có dữ liệu</td></tr> : viewData.map((h, idx) => (
                        <tr key={idx}><td className="py-1 px-2">{h.time}</td><td className="py-1 px-2">{h.action}</td></tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            <div className="flex gap-3 justify-end mt-4">
              <button onClick={closeViewModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa giữ nguyên */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-blue-700">Chỉnh sửa tài khoản</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Tên</label>
              <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Email</label>
              <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="mb-6">
              <label className="block font-semibold mb-1">Vai trò</label>
              <select name="role" value={editForm.role} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500">
                {ROLES.filter(r => r.value !== "all").map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={closeEditModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Hủy</button>
              <button onClick={saveEdit} disabled={saving} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60">{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa giữ nguyên */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm animate-fadeIn">
            <h2 className="text-xl font-bold mb-4 text-red-600">Xác nhận xóa người dùng</h2>
            <p className="mb-6">Bạn có chắc chắn muốn xóa tài khoản <span className="font-bold">{selectedUser?.name}</span> không?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={closeDeleteModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Hủy</button>
              <button onClick={confirmDelete} disabled={deleting} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-60">{deleting ? 'Đang xóa...' : 'Xóa'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers; 