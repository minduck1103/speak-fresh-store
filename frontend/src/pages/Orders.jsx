import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { getMyOrders } from "../services/orderService";
import api from "../services/api";

const Orders = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getMyOrders();
        setOrders(res.data || []);
      } catch (err) {
        setError(t('orders.load_error', { ns: 'pages' }));
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async () => {
    if (!selected) return;
    setCancelLoading(true);
    setCancelSuccess("");
    try {
      await api.put(`/api/v1/orders/${selected._id}/cancel`);
      setCancelSuccess(t('orders.cancel_success', { ns: 'pages' }));
      setSelected(null);
      setOrders(orders.filter(o => o._id !== selected._id));
    } catch (err) {
      setCancelSuccess(t('orders.cancel_error', { ns: 'pages' }));
    } finally {
      setCancelLoading(false);
      setShowCancelModal(false);
      setTimeout(() => setCancelSuccess(""), 2000);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selected) return;
    setDeleteLoading(true);
    setDeleteSuccess("");
    try {
      await api.delete(`/api/v1/orders/${selected._id}`);
      setDeleteSuccess(t('orders.delete_success', { ns: 'pages' }));
      setSelected(null);
      setOrders(orders.filter(o => o._id !== selected._id));
    } catch (err) {
      setDeleteSuccess(t('orders.delete_error', { ns: 'pages' }));
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
      setTimeout(() => setDeleteSuccess(""), 2000);
    }
  };

  return (
    <div className="bg-green-50 min-h-screen py-10 pt-40">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">{t('orders.title', { ns: 'pages' })}</h1>
        {loading ? (
          <div className="text-center text-green-600 py-8">{t('messages.loading', { ns: 'pages' })}</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-green-200 rounded-lg">
              <thead className="bg-green-100">
                <tr>
                  <th className="py-2 px-4">{t('orders.order_id', { ns: 'pages' })}</th>
                  <th className="py-2 px-4">{t('orders.order_date', { ns: 'pages' })}</th>
                  <th className="py-2 px-4">{t('orders.status', { ns: 'pages' })}</th>
                  <th className="py-2 px-4">{t('orders.total_amount', { ns: 'pages' })}</th>
                  <th className="py-2 px-4">{t('orders.details', { ns: 'pages' })}</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-6 text-gray-400">{t('orders.no_orders', { ns: 'pages' })}</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id} className="border-t border-green-100">
                      <td className="py-2 px-4 font-semibold text-green-700">{order._id}</td>
                      <td className="py-2 px-4">{order.createdAt?.slice(0,10)}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${order.status === 'delivered' ? 'bg-green-200 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status || 'Đang xử lý'}</span>
                      </td>
                      <td className="py-2 px-4 text-green-600 font-bold">{order.totalAmount?.toLocaleString()}₫</td>
                      <td className="py-2 px-4">
                        <button onClick={() => setSelected(order)} className="text-green-600 underline hover:text-green-800">{t('orders.view', { ns: 'pages' })}</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {selected && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border-2 border-green-200 max-h-[90vh] overflow-y-auto flex flex-col justify-between">
              <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-3xl font-bold">×</button>
              <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">{t('orders.order_details', { ns: 'pages' })}</h2>
              <div className="mb-3 flex flex-col md:flex-row md:justify-between gap-2">
                <div className="text-gray-700">{t('orders.order_id', { ns: 'pages' })}: <span className="font-semibold text-green-700">{selected._id}</span></div>
                <div className="text-gray-700">{t('orders.order_date', { ns: 'pages' })}: <span className="font-semibold">{selected.createdAt?.slice(0,10)}</span></div>
              </div>
              <div className="mb-3 text-gray-700">{t('orders.status', { ns: 'pages' })}: <span className={`font-bold px-4 py-1 rounded ${selected.status === 'delivered' ? 'bg-green-200 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selected.status || t('orders.processing', { ns: 'pages' })}</span></div>
              <div className="mb-3 text-gray-700">{t('orders.total_amount', { ns: 'pages' })}: <span className="font-bold text-2xl text-green-600">{selected.totalAmount?.toLocaleString()}₫</span></div>
              <div className="mb-3 text-gray-700">{t('orders.shipping_info', { ns: 'pages' })}:</div>
              <div className="mb-4 bg-green-50 rounded-lg p-3 border border-green-100">
                <div><span className="font-semibold">{t('orders.recipient', { ns: 'pages' })}:</span> {selected.shippingInfo?.name}</div>
                <div><span className="font-semibold">{t('orders.phone', { ns: 'pages' })}:</span> {selected.shippingInfo?.phoneNo}</div>
                <div><span className="font-semibold">{t('orders.address', { ns: 'pages' })}:</span> {selected.shippingInfo?.address}, {selected.shippingInfo?.city}</div>
              </div>
              <div className="mb-2 text-gray-700 font-semibold">{t('orders.products', { ns: 'pages' })}:</div>
              <div className="overflow-x-auto mb-4">
                <table className="w-full text-sm border border-green-100 rounded-lg mb-4">
                  <thead className="bg-green-100">
                    <tr>
                      <th className="py-2 px-2">{t('orders.image', { ns: 'pages' })}</th>
                      <th className="py-2 px-2">{t('orders.name', { ns: 'pages' })}</th>
                      <th className="py-2 px-2">{t('orders.quantity', { ns: 'pages' })}</th>
                      <th className="py-2 px-2">{t('orders.price', { ns: 'pages' })}</th>
                      <th className="py-2 px-2">{t('orders.subtotal', { ns: 'pages' })}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selected.items || []).map((item, idx) => (
                      <tr key={idx} className="border-t border-green-50">
                        <td className="py-2 px-2">
                          <img src={item.product?.image || item.image} alt={item.product?.name || item.name} className="w-12 h-12 object-cover rounded" />
                        </td>
                        <td className="py-2 px-2 font-semibold text-green-700">{item.product?.name || item.name}</td>
                        <td className="py-2 px-2 text-center">{item.qty || item.quantity || 1}</td>
                        <td className="py-2 px-2">{(item.product?.price || item.price)?.toLocaleString()}₫</td>
                        <td className="py-2 px-2 font-bold">{((item.product?.price || item.price) * (item.qty || item.quantity || 1)).toLocaleString()}₫</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={() => setSelected(null)} className="w-full mt-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg">{t('buttons.close', { ns: 'common' })}</button>
              <button onClick={() => setShowDeleteModal(true)} className="w-full mt-2 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors text-lg">{t('orders.delete_order', { ns: 'pages' })}</button>
              {selected.status === 'waiting_pickup' && (
                <button onClick={() => setShowCancelModal(true)} className="w-full mt-2 bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition-colors text-lg">{t('orders.cancel_order', { ns: 'pages' })}</button>
              )}
            </div>
          </div>
        )}
        {/* Modal xác nhận hủy đơn hàng */}
        {showCancelModal && selected && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
              <h2 className="text-xl font-bold text-red-600 mb-4">{t('orders.confirm_cancel', { ns: 'pages' })}</h2>
              <p className="mb-6">{t('orders.cancel_confirmation', { ns: 'pages', orderId: selected._id })}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setShowCancelModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">{t('buttons.no', { ns: 'common' })}</button>
                <button onClick={handleCancelOrder} disabled={cancelLoading} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold">{cancelLoading ? t('orders.canceling', { ns: 'pages' }) : t('orders.cancel_order', { ns: 'pages' })}</button>
              </div>
            </div>
          </div>
        )}
        {/* Modal xác nhận xóa đơn hàng */}
        {showDeleteModal && selected && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center">
              <h2 className="text-xl font-bold text-red-600 mb-4">{t('orders.confirm_delete', { ns: 'pages' })}</h2>
              <p className="mb-6">{t('orders.delete_confirmation', { ns: 'pages', orderId: selected._id })}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 font-semibold">{t('buttons.no', { ns: 'common' })}</button>
                <button onClick={handleDeleteOrder} disabled={deleteLoading} className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold">{deleteLoading ? t('orders.deleting', { ns: 'pages' }) : t('orders.delete_order', { ns: 'pages' })}</button>
              </div>
            </div>
          </div>
        )}
        {/* Thông báo hủy thành công */}
        {cancelSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs text-center">
              <div className="text-3xl text-green-600 mb-2">✔️</div>
              <div className="text-lg font-bold text-green-700 mb-2">{cancelSuccess}</div>
            </div>
          </div>
        )}
        {/* Thông báo xóa thành công */}
        {deleteSuccess && (
          <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs text-center">
              <div className="text-3xl text-green-600 mb-2">✔️</div>
              <div className="text-lg font-bold text-green-700 mb-2">{deleteSuccess}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;