import React, { useState, useEffect } from "react";
import api from "../../services/api";

const ROLES = [
  { value: "all", label: "Tất cả" },
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
  { value: "seller", label: "Seller" },
  { value: "delivery", label: "Delivery" },
  { value: "warehouse", label: "Warehouse" }
];

const ROLE_COLORS = {
  admin: "bg-blue-100 text-blue-700",
  user: "bg-green-100 text-green-700",
  seller: "bg-yellow-100 text-yellow-700",
  delivery: "bg-purple-100 text-purple-700",
  warehouse: "bg-orange-100 text-orange-700"
};

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ 
    name: "", 
    email: "", 
    role: "user",
    password: ""
  });
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
      const updateData = { ...editForm };
      if (!updateData.password) {
        delete updateData.password;
      }
      await api.put(`/users/${selectedUser._id}`, updateData);
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

  // Xem thông tin tài khoản
  const openInfoModal = (user) => {
    setSelectedUser(user);
    setShowInfoModal(true);
  };

  const closeInfoModal = () => {
    setShowInfoModal(false);
    setSelectedUser(null);
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
                  <button onClick={() => openInfoModal(c)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow text-xs">Thông tin</button>
                  <button onClick={() => openEditModal(c)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded shadow text-xs">Chỉnh sửa</button>
                  <button onClick={() => openDeleteModal(c)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow text-xs">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Modal */}
      {showInfoModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Thông tin tài khoản</h3>
            <div className="space-y-4">
              <div>
                <label className="font-medium text-gray-700">Tên:</label>
                <p className="mt-1">{selectedUser.name}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Email:</label>
                <p className="mt-1">{selectedUser.email}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Vai trò:</label>
                <p className="mt-1">{selectedUser.role}</p>
              </div>
              <div>
                <label className="font-medium text-gray-700">Ngày tạo:</label>
                <p className="mt-1">{new Date(selectedUser.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeInfoModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View History Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Lịch sử hoạt động</h3>
            {viewLoading ? (
              <div className="text-center py-4">Đang tải...</div>
            ) : viewError ? (
              <div className="text-red-600 text-center py-4">{viewError}</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {viewData.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">Không có dữ liệu lịch sử</div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 text-left">Thời gian</th>
                        <th className="py-2 px-4 text-left">Hoạt động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewData.map((item, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2 px-4">{item.time || new Date(item.createdAt).toLocaleString('vi-VN')}</td>
                          <td className="py-2 px-4">{item.action || `Đơn hàng #${item._id}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeViewModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Chỉnh sửa người dùng</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tên</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vai trò</label>
                <select
                  name="role"
                  value={editForm.role}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  {ROLES.filter(r => r.value !== 'all').map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mật khẩu mới (để trống nếu không thay đổi)
                </label>
                <input
                  type="password"
                  name="password"
                  value={editForm.password}
                  onChange={handleEditChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers; 