import React, { useState, useEffect } from 'react';
import { FaTruck, FaClipboardList, FaMapMarkedAlt, FaBell, FaChartBar, FaCamera, FaMoneyBillWave } from 'react-icons/fa';
import api from '../../services/api';
import { message } from 'antd';
import html2pdf from 'html2pdf.js';

// Tab bar component
const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaClipboardList /> },
    { key: 'tasks', label: 'Tasks', icon: <FaTruck /> },
    { key: 'map', label: 'Map', icon: <FaMapMarkedAlt /> },
    { key: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { key: 'reports', label: 'Reports', icon: <FaChartBar /> },
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
      <h3 className="font-bold text-green-700">Order #{order._id}</h3>
      <div className="text-sm font-medium text-green-600">
        {order.paymentMethod === 'COD' && `COD: ${order.totalAmount?.toLocaleString()}đ`}
      </div>
    </div>
    <div className="space-y-2 text-sm">
      <p><span className="font-medium">Receiver:</span> {order.shippingInfo?.name}</p>
      <p><span className="font-medium">Phone:</span> {order.shippingInfo?.phone}</p>
      <p><span className="font-medium">Address:</span> {order.shippingInfo?.address}</p>
      <p><span className="font-medium">Products:</span> {order.items?.map(item => item.name).join(', ')}</p>
      <p><span className="font-medium">Status:</span> <span className="text-green-700 font-bold">{order.status}</span></p>
    </div>
    <div className="mt-4 flex flex-wrap gap-2">
      {order.status === 'pending' ? (
        <>
          <button
            onClick={() => onAccept(order._id)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Accept
          </button>
          <button
            onClick={() => onReject(order._id)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reject
          </button>
        </>
      ) : (
        <>
          <select
            value={order.status}
            onChange={(e) => onStatusUpdate(order._id, e.target.value)}
            className="p-2 border border-green-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500"
          >
            <option value="picked_up">Picked up</option>
            <option value="delivering">Delivering</option>
            <option value="delivered">Delivered</option>
            <option value="failed">Failed</option>
          </select>
          {/* Xác nhận thu COD */}
          {order.paymentMethod === 'COD' && order.status === 'delivered' && !order.codConfirmed && (
            <button
              onClick={() => onCODConfirm(order._id)}
              className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              <FaMoneyBillWave /> Confirm COD
            </button>
          )}
          {/* Chụp ảnh bằng chứng giao hàng (placeholder) */}
          {order.status === 'delivered' && (
            <button
              onClick={() => onCaptureProof(order._id)}
              className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              <FaCamera /> Capture proof
            </button>
          )}
        </>
      )}
    </div>
  </div>
);

const ExportReportModal = ({ stats = {}, onClose }) => {
  const {
    totalDeliveries = 0,
    successRate = 0,
    onTimeRate = 0,
    totalCOD = 0
  } = stats;
  
  const printReport = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-green-700">Report</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div id="delivery-report-pdf-content" className="space-y-8">
          <div>
            <h3 className="text-xl font-bold text-green-700 mb-4">Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total deliveries</div>
                <div className="text-2xl font-bold text-green-700">{totalDeliveries}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Success rate</div>
                <div className="text-2xl font-bold text-green-700">{successRate}%</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">On time rate</div>
                <div className="text-2xl font-bold text-green-700">{onTimeRate}%</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total COD</div>
                <div className="text-2xl font-bold text-green-700">{totalCOD.toLocaleString()}₫</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-2">
          <button 
            onClick={printReport}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            🖨️ Print report
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('delivery-report-pdf-content');
              html2pdf().from(el).save('delivery-report.pdf');
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            🖨️ Export PDF
          </button>
        </div>
      </div>
    </div>
  );
};

const DeliveryDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [stats, setStats] = useState({
    totalDeliveries: 1247,
    successRate: 92,
    onTimeRate: 88,
    totalCOD: 123450000
  });
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([
    {
      _id: "DEL123456",
      shippingInfo: {
        name: "Nguyễn Văn A",
        address: "123 Lê Lợi, Quận 1, TP.HCM"
      },
      totalAmount: 850000,
      deliveredAt: "2025-05-29T08:30:00"
    },
    {
      _id: "DEL123457",
      shippingInfo: {
        name: "Trần Thị B",
        address: "456 Nguyễn Huệ, Quận 1, TP.HCM"
      },
      totalAmount: 1250000,
      deliveredAt: "2025-05-29T10:15:00"
    },
    {
      _id: "DEL123458",
      shippingInfo: {
        name: "Phạm Văn C",
        address: "789 Lý Tự Trọng, Quận 3, TP.HCM"
      },
      totalAmount: 750000,
      deliveredAt: "2025-05-29T14:45:00"
    }
  ]);

  useEffect(() => {
    fetchOrders();
    fetchStats();
    fetchNotifications();
    fetchHistory();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/v1/delivery/orders');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    // Luôn dùng mock data để test giao diện
    setStats({
      totalDeliveries: 1247,
      successRate: 92,
      onTimeRate: 88,
      totalCOD: 123450000
    });
    setLoading(false);
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
      message.success('Order accepted successfully');
      fetchOrders();
      fetchStats();
    } catch (error) {
      message.error('Error accepting order');
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await api.put(`/api/v1/delivery/orders/${orderId}/reject`);
      message.success('Order rejected successfully');
      fetchOrders();
      fetchStats();
    } catch (error) {
      message.error('Error rejecting order');
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await api.put(`/api/v1/delivery/orders/${orderId}/status`, { status });
      message.success('Order status updated successfully');
      fetchOrders();
      fetchStats();
    } catch (error) {
      message.error('Error updating order status');
    }
  };

  const handleConfirmCOD = async (orderId) => {
    try {
      await api.put(`/api/v1/delivery/orders/${orderId}/cod`);
      message.success('COD payment confirmed successfully');
      fetchOrders();
      fetchStats();
    } catch (error) {
      message.error('Error confirming COD payment');
    }
  };

  const handleCaptureProof = (orderId) => {
    // Placeholder: Hiện modal hoặc thông báo (có thể tích hợp upload ảnh thực tế sau)
    alert('Function capture image will be developed!');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-700">Delivery Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">{stats.totalDeliveries}</div>
                <div className="text-sm text-gray-600">Total deliveries</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">{stats.successRate}%</div>
                <div className="text-sm text-gray-600">Success rate</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">{stats.onTimeRate}%</div>
                <div className="text-sm text-gray-600">On time rate</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">{stats.totalCOD.toLocaleString()}đ</div>
                <div className="text-sm text-gray-600">Total COD</div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-green-700">List of orders</h2>
            {orders.length === 0 ? (
              <div className="text-center text-gray-500">No orders.</div>
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
            <h2 className="text-2xl font-bold text-green-700">Task management</h2>
            {orders.filter(order => order.status !== 'pending').length === 0 ? (
              <div className="text-center text-gray-500">No tasks.</div>
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
            <h2 className="text-2xl font-bold text-green-700">Navigation map</h2>
            <div className="bg-white p-4 rounded-lg shadow h-[600px]">
              {/* Map integration will go here */}
              <div className="h-full flex items-center justify-center text-gray-500">
                Navigation map feature is under development...
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-700">Notifications</h2>
            <div className="bg-white rounded-lg shadow">
              {notifications.length === 0 ? (
                <div className="text-center text-gray-500 p-4">No notifications.</div>
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
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-green-700">Performance report & Delivery history</h2>
              <button
                onClick={() => setShowExportModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              >
                📊 Export report
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">{stats.totalDeliveries}</div>
                <div className="text-sm text-gray-600">Total deliveries</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">{stats.successRate}%</div>
                <div className="text-sm text-gray-600">Success rate</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">{stats.onTimeRate}%</div>
                <div className="text-sm text-gray-600">On time rate</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-green-600">{stats.totalCOD.toLocaleString()}đ</div>
                <div className="text-sm text-gray-600">Total COD</div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-bold text-green-700 mb-2">Recent delivery history</h3>
              {history.length === 0 ? (
                <div className="text-center text-gray-500">No orders delivered yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-green-50">
                        <th className="py-2 px-3">Order ID</th>
                        <th className="py-2 px-3">Receiver</th>
                        <th className="py-2 px-3">Address</th>
                        <th className="py-2 px-3">Order value</th>
                        <th className="py-2 px-3">Delivery date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(order => (
                        <tr key={order._id} className="border-b">
                          <td className="py-2 px-3 font-semibold text-green-700">{order._id}</td>
                          <td className="py-2 px-3">{order.shippingInfo?.name}</td>
                          <td className="py-2 px-3">{order.shippingInfo?.address}</td>
                          <td className="py-2 px-3">{order.totalAmount?.toLocaleString()}đ</td>
                          <td className="py-2 px-3">{new Date(order.deliveredAt).toLocaleDateString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {showExportModal && <ExportReportModal stats={stats} onClose={() => setShowExportModal(false)} />}
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
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