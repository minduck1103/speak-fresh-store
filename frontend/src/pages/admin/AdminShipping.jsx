import { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const AdminShipping = () => {
  const [shippingFees, setShippingFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    districtName: "",
    shippingFee: 0
  });
  const [message, setMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ districtName: '', shippingFee: 0 });
  const [addLoading, setAddLoading] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ user: '', product: '', name: '', rating: 5, comment: '' });
  const [reviewUsers, setReviewUsers] = useState([]);
  const [reviewProducts, setReviewProducts] = useState([]);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewSaving, setReviewSaving] = useState(false);
  const [searchShipping, setSearchShipping] = useState("");

  useEffect(() => {
    fetchShippingFees();
  }, []);

  const fetchShippingFees = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/v1/shipping");
      setShippingFees(res.data.data || []);
    } catch (err) {
      setError("Không thể tải danh sách phí vận chuyển");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (shipping) => {
    setSelected(shipping);
    setFormData({
      districtName: shipping.districtName,
      shippingFee: shipping.shippingFee
    });
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "shippingFee" ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await api.put(`/api/v1/shipping/${selected._id}`, formData);
      setEditing(false);
      fetchShippingFees();
      setMessage("Cập nhật phí vận chuyển thành công!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Không thể cập nhật phí vận chuyển. Vui lòng thử lại!");
      console.error(err);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setAddForm({ ...addForm, [name]: name === 'shippingFee' ? Number(value) : value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setAddLoading(true);
    try {
      await api.post('/api/v1/shipping', addForm);
      setShowAddModal(false);
      setAddForm({ districtName: '', shippingFee: 0 });
      fetchShippingFees();
      setMessage('Thêm phí vận chuyển thành công!');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Không thể thêm phí vận chuyển. Vui lòng thử lại!');
    } finally {
      setAddLoading(false);
    }
  };

  const fetchReviews = useCallback(async () => {
    setReviewLoading(true);
    setReviewError("");
    try {
      const res = await api.get("/reviews");
      setReviews(res.data.data || []);
    } catch (err) {
      setReviewError("Không thể tải danh sách đánh giá");
    } finally {
      setReviewLoading(false);
    }
  }, []);

  const fetchReviewUsers = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/users");
      let users = res.data;
      if (users && typeof users === 'object') {
        if (Array.isArray(users.data)) users = users.data;
        else if (Array.isArray(users.users)) users = users.users;
        else if (Array.isArray(users.results)) users = users.results;
      }
      setReviewUsers(Array.isArray(users) ? users : []);
    } catch (err) { console.error(err); }
  }, []);

  const fetchReviewProducts = useCallback(async () => {
    try {
      const res = await api.get("/products");
      let prods = Array.isArray(res.data) ? res.data : res.data.data || [];
      setReviewProducts(prods);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const openAddReview = async () => {
    setEditingReview(null);
    setReviewForm({ user: '', product: '', name: '', rating: 5, comment: '' });
    setReviewMessage("");
    await fetchReviewUsers();
    await fetchReviewProducts();
    setShowReviewModal(true);
  };

  const openEditReview = async (r) => {
    setEditingReview(r);
    setReviewForm({
      user: r.user,
      product: r.product,
      name: r.name,
      rating: r.rating,
      comment: r.comment
    });
    setReviewMessage("");
    await fetchReviewUsers();
    await fetchReviewProducts();
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setEditingReview(null);
    setReviewForm({ user: '', product: '', name: '', rating: 5, comment: '' });
  };

  const handleReviewFormChange = (e) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const saveReview = async (e) => {
    e.preventDefault();
    setReviewSaving(true);
    setReviewMessage("");
    try {
      if (editingReview) {
        await api.put(`/reviews/${editingReview._id}`, reviewForm);
        setReviewMessage("Cập nhật đánh giá thành công!");
      } else {
        await api.post(`/products/${reviewForm.product}/reviews`, reviewForm);
        setReviewMessage("Thêm đánh giá thành công!");
      }
      fetchReviews();
      setShowReviewModal(false);
    } catch (err) {
      setReviewMessage(err.response?.data?.error || "Không thể lưu đánh giá. Vui lòng thử lại!");
    } finally {
      setReviewSaving(false);
    }
  };

  const deleteReview = async (r) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await api.delete(`/reviews/${r._id}`);
      fetchReviews();
      setReviewMessage("Xóa đánh giá thành công!");
    } catch (err) {
      setReviewMessage("Không thể xóa đánh giá. Vui lòng thử lại!");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
          🚚 Quản lý phí vận chuyển
        </h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchShipping}
            onChange={e => setSearchShipping(e.target.value)}
            className="border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Thêm phí vận chuyển
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-green-100">
                  <th className="py-3 px-4">Tên quận</th>
                  <th className="py-3 px-4">Phí vận chuyển</th>
                  <th className="py-3 px-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {shippingFees.filter(s =>
                  s._id.toLowerCase().includes(searchShipping.toLowerCase()) ||
                  (s.recipientName && s.recipientName.toLowerCase().includes(searchShipping.toLowerCase())) ||
                  (s.address && s.address.toLowerCase().includes(searchShipping.toLowerCase()))
                ).map((shipping) => (
                  <tr key={shipping._id} className="border-b hover:bg-green-50">
                    <td className="py-3 px-4">{shipping.districtName}</td>
                    <td className="py-3 px-4">
                      {shipping.shippingFee.toLocaleString()}₫
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEdit(shipping)}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors"
                      >
                        Sửa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa phí vận chuyển */}
      {editing && selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-green-700 mb-4">
              Chỉnh sửa phí vận chuyển
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tên quận</label>
                <input
                  type="text"
                  name="districtName"
                  value={formData.districtName}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Phí vận chuyển (VNĐ)
                </label>
                <input
                  type="number"
                  name="shippingFee"
                  value={formData.shippingFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  min="0"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal thêm phí vận chuyển */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Thêm phí vận chuyển</h2>
            <form onSubmit={handleAddSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tên quận</label>
                <input
                  type="text"
                  name="districtName"
                  value={addForm.districtName}
                  onChange={handleAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Phí vận chuyển (VNĐ)</label>
                <input
                  type="number"
                  name="shippingFee"
                  value={addForm.shippingFee}
                  onChange={handleAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  disabled={addLoading}
                >
                  {addLoading ? 'Đang thêm...' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {message && (
        <div className={`my-4 text-center font-bold ${message.includes('thành công') ? 'text-green-600' : 'text-red-500'}`}>{message}</div>
      )}

      {/* Section quản lý reviews */}
      <div className="mt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">⭐ Quản lý đánh giá sản phẩm</h2>
          <button
            onClick={openAddReview}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Thêm đánh giá
          </button>
        </div>
        {reviewLoading ? (
          <div className="text-center py-10">Đang tải đánh giá...</div>
        ) : reviewError ? (
          <div className="text-center text-red-500 py-10">{reviewError}</div>
        ) : (
          <div className="bg-white rounded-xl shadow p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-green-100">
                    <th className="py-3 px-4">Người dùng</th>
                    <th className="py-3 px-4">Sản phẩm</th>
                    <th className="py-3 px-4">Tên hiển thị</th>
                    <th className="py-3 px-4">Số sao</th>
                    <th className="py-3 px-4">Bình luận</th>
                    <th className="py-3 px-4">Ngày tạo</th>
                    <th className="py-3 px-4">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(r => (
                    <tr key={r._id} className="border-b hover:bg-green-50">
                      <td className="py-3 px-4">{reviewUsers.find(u => u._id === (r.user?._id || r.user))?.name || r.name || r.user}</td>
                      <td className="py-3 px-4">{reviewProducts.find(p => p._id === (r.product?._id || r.product))?.name || r.product}</td>
                      <td className="py-3 px-4">{r.name}</td>
                      <td className="py-3 px-4">{r.rating} ⭐</td>
                      <td className="py-3 px-4">{r.comment}</td>
                      <td className="py-3 px-4">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</td>
                      <td className="py-3 px-4 flex gap-2">
                        <button onClick={() => openEditReview(r)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 transition-colors">Sửa</button>
                        <button onClick={() => deleteReview(r)} className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors">Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {reviewMessage && (
          <div className={`my-4 text-center font-bold ${reviewMessage.includes('thành công') ? 'text-green-600' : 'text-red-500'}`}>{reviewMessage}</div>
        )}
        {/* Modal thêm/sửa review */}
        {showReviewModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-blue-700 mb-4">{editingReview ? 'Sửa đánh giá' : 'Thêm đánh giá'}</h2>
              <form onSubmit={saveReview}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Người dùng</label>
                  <select name="user" value={reviewForm.user} onChange={handleReviewFormChange} className="w-full px-3 py-2 border border-gray-300 rounded" required>
                    <option value="">Chọn người dùng</option>
                    {reviewUsers.map(u => <option key={u._id} value={u._id}>{u.name} ({u.email})</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Sản phẩm</label>
                  <select name="product" value={reviewForm.product} onChange={handleReviewFormChange} className="w-full px-3 py-2 border border-gray-300 rounded" required>
                    <option value="">Chọn sản phẩm</option>
                    {reviewProducts.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Tên hiển thị</label>
                  <input type="text" name="name" value={reviewForm.name} onChange={handleReviewFormChange} className="w-full px-3 py-2 border border-gray-300 rounded" required />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Số sao</label>
                  <select name="rating" value={reviewForm.rating} onChange={handleReviewFormChange} className="w-full px-3 py-2 border border-gray-300 rounded" required>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} ⭐</option>)}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Bình luận</label>
                  <textarea name="comment" value={reviewForm.comment} onChange={handleReviewFormChange} className="w-full px-3 py-2 border border-gray-300 rounded" required />
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={closeReviewModal} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" disabled={reviewSaving}>{reviewSaving ? 'Đang lưu...' : 'Lưu'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminShipping; 