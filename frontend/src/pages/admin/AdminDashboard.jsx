import React, { useState, useEffect } from "react";
import api from "../../services/api";

const StatCard = ({ icon, label, value, loading }) => (
  <div className="bg-green-100 rounded-xl p-6 flex flex-col items-center shadow-md">
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-2xl font-bold text-green-700">
      {loading ? "..." : value}
    </div>
    <div className="text-green-800 mt-1">{label}</div>
  </div>
);

const NotificationPanel = ({ notifications }) => (
  <div className="bg-white rounded-xl p-4 shadow-md">
    <h3 className="font-bold text-green-700 mb-2">Thông báo & Cảnh báo</h3>
    <ul className="text-sm text-gray-700 space-y-1">
      {notifications.map((notification, index) => (
        <li key={index}>{notification}</li>
      ))}
    </ul>
  </div>
);

const ReviewApprovalPanel = ({ pendingReviews, onApprove, onReject, loading }) => (
  <div className="bg-white rounded-xl p-4 shadow-md">
    <h3 className="font-bold text-green-700 mb-2">Đánh giá chờ duyệt</h3>
    {loading ? (
      <div className="text-center py-4">Đang tải...</div>
    ) : pendingReviews.length === 0 ? (
      <div className="text-center text-gray-500">Không có đánh giá nào chờ duyệt</div>
    ) : (
      <ul className="text-sm text-gray-700 space-y-2">
        {pendingReviews.map((review) => (
          <li key={review._id} className="flex items-center justify-between">
            <span>
              {review.user?.name || 'Ẩn danh'}: "{review.comment}"
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onApprove(review._id)}
                className="text-green-600 hover:text-green-700"
              >
                ✓
              </button>
              <button
                onClick={() => onReject(review._id)}
                className="text-red-600 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    newOrders: 0,
    products: 0,
    todayRevenue: 0,
    newReviews: 0,
    lowStockProducts: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchPendingReviews();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [usersRes, ordersRes, productsRes, reviewsRes] = await Promise.all([
        api.get('/users'),
        api.get('/orders'),
        api.get('/products'),
        api.get('/reviews')
      ]);

      // Xử lý số liệu thống kê
      const users = usersRes.data.data || usersRes.data;
      const orders = ordersRes.data.data || ordersRes.data;
      const products = productsRes.data.data || productsRes.data;
      const reviews = reviewsRes.data.data || reviewsRes.data;

      // Tính toán các số liệu
      const today = new Date().toISOString().split('T')[0];
      const todayOrders = orders.filter(order => 
        order.createdAt.startsWith(today)
      );
      const todayRevenue = todayOrders.reduce((sum, order) => 
        sum + (order.totalPrice || 0), 0
      );
      const lowStockProducts = products.filter(product => 
        (product.stock || 0) < 10
      );

      setStats({
        customers: users.filter(user => user.role === 'user').length,
        newOrders: todayOrders.length,
        products: products.length,
        todayRevenue,
        newReviews: reviews.filter(review => !review.isApproved).length,
        lowStockProducts: lowStockProducts.length
      });

      // Cập nhật thông báo
      const newNotifications = [
        lowStockProducts.length > 0 ? `⚠️ ${lowStockProducts.length} sản phẩm sắp hết hàng` : null,
        todayOrders.length > 0 ? `📦 ${todayOrders.length} đơn hàng mới hôm nay` : null,
        reviews.filter(r => !r.isApproved).length > 0 ? `⭐ ${reviews.filter(r => !r.isApproved).length} đánh giá mới chờ duyệt` : null
      ].filter(Boolean);

      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingReviews = async () => {
    try {
      setReviewsLoading(true);
      const response = await api.get('/reviews?approved=false');
      setPendingReviews(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error fetching pending reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleApproveReview = async (reviewId) => {
    try {
      await api.put(`/reviews/${reviewId}`, { isApproved: true });
      await fetchPendingReviews();
      await fetchDashboardData();
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      await api.delete(`/reviews/${reviewId}`);
      await fetchPendingReviews();
      await fetchDashboardData();
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
        🍏 Tổng quan hệ thống
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard icon="👤" label="Khách hàng" value={stats.customers} loading={loading} />
        <StatCard icon="🧾" label="Đơn hàng mới" value={stats.newOrders} loading={loading} />
        <StatCard icon="🍉" label="Sản phẩm đang bán" value={stats.products} loading={loading} />
        <StatCard 
          icon="💰" 
          label="Doanh thu hôm nay" 
          value={`${stats.todayRevenue.toLocaleString()}₫`} 
          loading={loading} 
        />
        <StatCard icon="⭐" label="Đánh giá mới" value={stats.newReviews} loading={loading} />
        <StatCard 
          icon="⚠️" 
          label="Cảnh báo hết hàng" 
          value={stats.lowStockProducts} 
          loading={loading} 
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotificationPanel notifications={notifications} />
        <ReviewApprovalPanel 
          pendingReviews={pendingReviews}
          onApprove={handleApproveReview}
          onReject={handleRejectReview}
          loading={reviewsLoading}
        />
      </div>
    </div>
  );
};

export default AdminDashboard; 