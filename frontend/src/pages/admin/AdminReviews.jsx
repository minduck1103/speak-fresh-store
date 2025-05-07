import React, { useState, useEffect, useCallback } from "react";
import api from "../../services/api";

const AdminReviews = () => {
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
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewReview, setViewReview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteSuccess, setShowDeleteSuccess] = useState(false);
  const [searchReview, setSearchReview] = useState("");

  const fetchReviews = useCallback(async () => {
    setReviewLoading(true);
    setReviewError("");
    try {
      const res = await api.get("/api/v1/reviews");
      setReviews(res.data.data || []);
    } catch (err) {
      setReviewError("Không thể tải danh sách đánh giá");
    } finally {
      setReviewLoading(false);
    }
  }, []);

  const fetchReviewUsers = useCallback(async () => {
    try {
      const res = await api.get("/users");
      let users = res.data;
      if (users && typeof users === 'object') {
        if (Array.isArray(users.data)) users = users.data;
        else if (Array.isArray(users.users)) users = users.users;
        else if (Array.isArray(users.results)) users = users.results;
      }
      setReviewUsers(Array.isArray(users) ? users : []);
    } catch {}
  }, []);

  const fetchReviewProducts = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/products");
      let prods = Array.isArray(res.data) ? res.data : res.data.data || [];
      setReviewProducts(prods);
    } catch {}
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

  const openViewReview = async (r) => {
    setViewReview(r);
    await fetchReviewUsers();
    await fetchReviewProducts();
    setShowViewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setEditingReview(null);
    setReviewForm({ user: '', product: '', name: '', rating: 5, comment: '' });
  };

  const closeViewModal = () => {
    setShowViewModal(false);
    setViewReview(null);
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
        await api.put(`/api/v1/reviews/${editingReview._id}`, reviewForm);
        setReviewMessage("Cập nhật đánh giá thành công!");
      } else {
        await api.post(`/api/v1/products/${reviewForm.product}/reviews`, reviewForm);
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

  const openDeleteModal = (r) => {
    setDeleteTarget(r);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const confirmDeleteReview = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/v1/reviews/${deleteTarget._id}`);
      fetchReviews();
      setShowDeleteModal(false);
      setShowDeleteSuccess(true);
      setTimeout(() => setShowDeleteSuccess(false), 2000);
      setReviewMessage("Xóa đánh giá thành công!");
    } catch (err) {
      setReviewMessage("Không thể xóa đánh giá. Vui lòng thử lại!");
      setShowDeleteModal(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">⭐ Quản lý đánh giá sản phẩm</h1>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchReview}
            onChange={e => setSearchReview(e.target.value)}
            className="border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
          />
          <button
            onClick={openAddReview}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Thêm đánh giá
          </button>
        </div>
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
                  <th className="py-3 px-4">Ngày tạo</th>
                  <th className="py-3 px-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {reviews.filter(r => {
                  const user = reviewUsers.find(u => u._id === (r.user?._id || r.user));
                  const product = reviewProducts.find(p => p._id === (r.product?._id || r.product));
                  return (
                    (user && user.name && user.name.toLowerCase().includes(searchReview.toLowerCase())) ||
                    (product && product.name && product.name.toLowerCase().includes(searchReview.toLowerCase())) ||
                    (r.name && r.name.toLowerCase().includes(searchReview.toLowerCase())) ||
                    (r.comment && r.comment.toLowerCase().includes(searchReview.toLowerCase()))
                  );
                }).map(r => (
                  <tr key={r._id} className="border-b hover:bg-green-50">
                    <td className="py-3 px-4">{reviewUsers.find(u => u._id === (r.user?._id || r.user))?.name || r.name || r.user}</td>
                    <td className="py-3 px-4">{reviewProducts.find(p => p._id === (r.product?._id || r.product))?.name || r.product}</td>
                    <td className="py-3 px-4">{r.name}</td>
                    <td className="py-3 px-4">{r.rating} ⭐</td>
                    <td className="py-3 px-4">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <button onClick={() => openViewReview(r)} className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors">Xem</button>
                      <button onClick={() => openDeleteModal(r)} className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition-colors">Xóa</button>
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
      {/* Modal xem chi tiết review */}
      {showViewModal && viewReview && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-green-700 mb-4">Chi tiết đánh giá</h2>
            <div className="mb-2"><b>Người dùng:</b> {reviewUsers.find(u => u._id === (viewReview.user?._id || viewReview.user))?.name || viewReview.name || viewReview.user}</div>
            <div className="mb-2"><b>Sản phẩm:</b> {reviewProducts.find(p => p._id === (viewReview.product?._id || viewReview.product))?.name || viewReview.product}</div>
            <div className="mb-2"><b>Tên hiển thị:</b> {viewReview.name}</div>
            <div className="mb-2"><b>Số sao:</b> {viewReview.rating} ⭐</div>
            <div className="mb-2"><b>Bình luận:</b> {viewReview.comment}</div>
            <div className="mb-2"><b>Ngày tạo:</b> {viewReview.createdAt ? new Date(viewReview.createdAt).toLocaleDateString() : ''}</div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={closeViewModal} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors">Đóng</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal xác nhận xóa */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-red-600 mb-4">Xác nhận xóa đánh giá</h2>
            <p className="mb-6">Bạn có chắc chắn muốn xóa đánh giá của <span className="font-bold">{reviewUsers.find(u => u._id === (deleteTarget.user?._id || deleteTarget.user))?.name || deleteTarget.name || deleteTarget.user}</span> cho sản phẩm <span className="font-bold">{reviewProducts.find(p => p._id === (deleteTarget.product?._id || deleteTarget.product))?.name || deleteTarget.product}</span> không?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={closeDeleteModal} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">Hủy</button>
              <button onClick={confirmDeleteReview} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews; 