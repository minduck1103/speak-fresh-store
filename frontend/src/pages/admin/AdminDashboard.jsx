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
    <h3 className="font-bold text-green-700 mb-2">New notifications</h3>
    <ul className="text-sm text-gray-700 space-y-1">
      {notifications.map((notification, index) => (
        <li key={index}>{notification}</li>
      ))}
    </ul>
  </div>
);

const ReviewApprovalPanel = ({ pendingReviews, onApprove, onReject, loading }) => (
  <div className="bg-white rounded-xl p-4 shadow-md">
    <h3 className="font-bold text-green-700 mb-2">Reviews Pending Approval</h3>
    {loading ? (
      <div className="text-center py-4">Loading...</div>
    ) : pendingReviews.length === 0 ? (
      <div className="text-center text-gray-500">No reviews pending approval</div>
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
                title="Approve"
              >
                ✓
              </button>
              <button
                onClick={() => onReject(review._id)}
                className="text-red-600 hover:text-red-700"
                title="Reject"
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
    customers: 1234,            // 1,234 khách hàng
    newOrders: 85,             // 85 đơn hàng mới
    totalOrders: 2847,         // 2,847 tổng đơn hàng
    products: 156,             // 156 sản phẩm
    todayRevenue: 157850000,   // 157.85tr doanh thu hôm nay
    totalRevenue: 5230000000,  // 5.23B tổng doanh thu
    newReviews: 45,            // 45 đánh giá mới
    lowStockProducts: 12       // 12 sản phẩm sắp hết hàng
  });
  const [notifications, setNotifications] = useState([
    "📊 Doanh thu tháng 5 đạt 5.23B VND",
    "📈 Tăng trưởng 25% so với tháng trước",
    "📦 85 đơn hàng mới cần xử lý",
    "⭐ 45 đánh giá đang chờ duyệt",
    "⚠️ 12 sản phẩm sắp hết hàng",
    "💰 Doanh thu hôm nay: 157.85tr VND",
    "🎉 Đã vượt chỉ tiêu tháng 5/2025"
  ]);
  const [pendingReviews, setPendingReviews] = useState([
    {
      _id: "REV001",
      user: { name: "Nguyễn Văn A" },
      comment: "Sản phẩm rất tươi và ngon",
      rating: 5
    },
    {
      _id: "REV002", 
      user: { name: "Trần Thị B" },
      comment: "Giao hàng nhanh, đóng gói cẩn thận",
      rating: 5
    },
    {
      _id: "REV003",
      user: { name: "Phạm Văn C" },
      comment: "Chất lượng tuyệt vời",
      rating: 4
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    // Không cần gọi API vì đã có mock data
    setLoading(false);
    setReviewsLoading(false);
  }, []);

  const handleApproveReview = async (reviewId) => {
    setPendingReviews(prev => prev.filter(review => review._id !== reviewId));
    setStats(prev => ({ ...prev, newReviews: prev.newReviews - 1 }));
  };

  const handleRejectReview = async (reviewId) => {
    setPendingReviews(prev => prev.filter(review => review._id !== reviewId));
    setStats(prev => ({ ...prev, newReviews: prev.newReviews - 1 }));
  };

  return (
  <div>
      <h1 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">
        🍏 Dashboard
      </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon="👤" label="Total Customers" value={stats.customers} loading={loading} />
        <StatCard icon="📦" label="Total Orders" value={stats.totalOrders} loading={loading} />
        <StatCard icon="🔔" label="New Orders Today" value={stats.newOrders} loading={loading} />
        <StatCard icon="🍉" label="Total Products" value={stats.products} loading={loading} />
        <StatCard
          icon="💰"
          label="Total Revenue"
          value={`${stats.totalRevenue.toLocaleString()}₫`}
          loading={loading}
        />
        <StatCard
          icon="📈"
          label="Today's Revenue" 
          value={`${stats.todayRevenue.toLocaleString()}₫`}
          loading={loading}
        />
        <StatCard icon="⭐" label="Pending Reviews" value={stats.newReviews} loading={loading} />
        <StatCard
          icon="⚠️"
          label="Low Stock Items"
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