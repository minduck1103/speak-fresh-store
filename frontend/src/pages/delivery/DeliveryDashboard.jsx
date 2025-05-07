import React, { useState, useEffect } from 'react';
import { FaTruck, FaClipboardList, FaMapMarkedAlt, FaBell, FaChartBar, FaCamera, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../services/api';
import { message } from 'antd';

// Tab bar component
const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaClipboardList /> },
    { key: 'tasks', label: 'Quản lý tác vụ', icon: <FaTruck /> },
    { key: 'map', label: 'Bản đồ', icon: <FaMapMarkedAlt /> },
    { key: 'notifications', label: 'Thông báo', icon: <FaBell /> },
    { key: 'reports', label: 'Báo cáo', icon: <FaChartBar /> },
  ];
  return (
    <div className="flex gap-2 bg-white rounded-t-xl shadow px-4 pt-4 pb-2 border-b border-green-100">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-semibold transition-colors text-green-700 border-b-4 ${
            activeTab === tab.key
              ? 'bg-green-100 border-green-600 text-green-800'
              : 'border-transparent hover:bg-green-50'
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const OrderCard = ({ order, onStatusUpdate, onAccept, onReject, onCODConfirm, onCaptureProof }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border border-green-100 mb-4">
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-bold text-green-700">Đơn hàng #{order._id}</h3>
      <div className="text-sm font-medium text-green-600">
        {order.paymentMethod === 'COD' && `COD: ${order.totalAmount?.toLocaleString()}₫`}
      </div>
    </div>
    <div className="space-y-2 text-sm">
      <p><span className="font-medium">Người nhận:</span> {order.shippingInfo?.name}</p>
      <p><span className="font-medium">SĐT:</span> {order.shippingInfo?.phone}</p>
      <p><span className="font-medium">Địa chỉ:</span> {order.shippingInfo?.address}</p>
      <p><span className="font-medium">Sản phẩm:</span> {order.items?.map(item => item.name).join(', ')}</p>
      <p><span className="font-medium">Trạng thái:</span> <span className="text-green-700 font-bold">{order.status}</span></p>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      {order.status === 'pending' ? (
        <>
          <button
            onClick={() => onAccept(order._id)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Nhận đơn
          </button>
          <button
            onClick={() => onReject(order._id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Từ chối
          </button>
        </>
      ) : (
        <>
          <select
            value={order.status}
            onChange={(e) => onStatusUpdate(order._id, e.target.value)}
            className="p-2 border border-green-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
          >
            <option value="picked_up">Đã lấy hàng</option>
            <option value="delivering">Đang giao hàng</option>
            <option value="delivered">Giao thành công</option>
            <option value="failed">Giao thất bại</option>
          </select>
          {/* Xác nhận thu COD */}
          {order.paymentMethod === 'COD' && order.status === 'delivered' && !order.codConfirmed && (
            <button
              onClick={() => onCODConfirm(order._id)}
              className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              <FaMoneyBillWave /> Xác nhận đã thu COD
            </button>
          )}
          {/* Chụp ảnh bằng chứng giao hàng (placeholder) */}
          {order.status === 'delivered' && (
            <button
              onClick={() => onCaptureProof(order._id)}
              className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              <FaCamera /> Chụp ảnh bằng chứng
            </button>
          )}
        </>
      )}
    </div>
  </div>
);

const DeliveryDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    successRate: 0,
    onTimeRate: 0,
    totalCOD: 0
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchNotifications();
    fetchHistory();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/v1/delivery/orders');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/v1/delivery/stats');
      setStats(response.data.data || {});
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/v1/delivery/notifications');
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get('/api/v1/delivery/orders?history=true');
      setHistory(response.data.data || []);
    } catch (error) {
      setHistory([]);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await api.put(`/api/v1/delivery/orders/${orderId}/accept`);
      message.success('Đã nhận đơn hàng thành công');
      fetchOrders();
      fetchStats();
    } catch (error) {
      message.error('Có lỗi xảy ra khi nhận đơn hàng');
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await api.put(`/api/v1/delivery/orders/${orderId}/reject`);
      message.success('Đã từ chối đơn hàng thành công');
      fetchOrders();
      fetchStats();
    } catch (error) {
      message.error('Có lỗi xảy ra khi từ chối đơn hàng');
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/v1/delivery/orders/${orderId}/status`, { status });
      message.success('Đã cập nhật trạng thái đơn hàng thành công');
      fetchOrders();
      fetchStats();
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật trạng thái đơn hàng');
    }
  };

  const handleConfirmCOD = async (orderId) => {
    try {
      await api.put(`/api/v1/delivery/orders/${orderId}/cod`);
      message.success('Đã xác nhận thanh toán COD thành công');
      fetchOrders();
      fetchStats();
    } catch (error) {
      message.error('Có lỗi xảy ra khi xác nhận thanh toán COD');
    }
  };

  const handleCaptureProof = (orderId) => {
    // Placeholder: Hiện modal hoặc thông báo (có thể tích hợp upload ảnh thực tế sau)
    alert('Chức năng chụp ảnh sẽ được phát triển!');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-700">Danh sách đơn hàng</h2>
            {orders.length === 0 ? (
              <div className="text-center text-gray-500">Không có đơn hàng nào được giao.</div>
            ) : (
              orders.map(order => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onStatusUpdate={handleUpdateStatus}
                  onAccept={handleAcceptOrder}
                  onReject={handleRejectOrder}
                  onCODConfirm={handleConfirmCOD}
                  onCaptureProof={handleCaptureProof}
                />
              ))
            )}
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-700">Quản lý tác vụ</h2>
            {orders.filter(order => order.status !== 'pending').length === 0 ? (
              <div className="text-center text-gray-500">Không có tác vụ nào.</div>
            ) : (
              orders
                .filter(order => order.status !== 'pending')
                .map(order => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onStatusUpdate={handleUpdateStatus}
                    onCODConfirm={handleConfirmCOD}
                    onCaptureProof={handleCaptureProof}
                  />
                ))
            )}
          </div>
        );
      case 'map':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-700">Bản đồ điều hướng</h2>
            <div className="bg-white p-4 rounded-lg shadow h-[600px]">
              {/* Map integration will go here */}
              <div className="h-full flex items-center justify-center text-gray-500">
                Tính năng bản đồ đang được phát triển...
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-700">Thông báo</h2>
            <div className="bg-white rounded-lg shadow">
              {notifications.length === 0 ? (
                <div className="text-center text-gray-500 p-4">Không có thông báo nào.</div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={notification._id || index}
                    className="p-4 border-b border-green-100 last:border-b-0"
                  >
                    <h3 className="font-medium text-green-700">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <span className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
        </div>
          </div>
        );
      case 'reports':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-700">Báo cáo hiệu suất & Lịch sử giao hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.totalDeliveries}
                </div>
                <div className="text-sm text-gray-600">Tổng số đơn đã giao</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.successRate}%
                </div>
                <div className="text-sm text-gray-600">Tỷ lệ giao thành công</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.onTimeRate}%
                </div>
                <div className="text-sm text-gray-600">Tỷ lệ giao đúng giờ</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.totalCOD?.toLocaleString()}₫
                </div>
                <div className="text-sm text-gray-600">Tổng tiền COD đã thu</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-green-700 mb-2">Lịch sử đơn đã giao</h3>
              {history.length === 0 ? (
                <div className="text-center text-gray-500">Chưa có đơn hàng nào được giao.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="py-2 px-3">Mã đơn</th>
                      <th className="py-2 px-3">Người nhận</th>
                      <th className="py-2 px-3">Địa chỉ</th>
                      <th className="py-2 px-3">Sản phẩm</th>
                      <th className="py-2 px-3">Trạng thái</th>
                      <th className="py-2 px-3">Ngày giao</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(order => (
                      <tr key={order._id} className="border-b">
                        <td className="py-2 px-3 font-semibold text-green-700">{order._id}</td>
                        <td className="py-2 px-3">{order.shippingInfo?.name}</td>
                        <td className="py-2 px-3">{order.shippingInfo?.address}</td>
                        <td className="py-2 px-3">{order.items?.map(item => item.name).join(', ')}</td>
                        <td className="py-2 px-3">{order.status}</td>
                        <td className="py-2 px-3">{order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-6xl mx-auto">
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DeliveryDashboard; 