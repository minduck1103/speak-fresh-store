import React, { useState, useEffect } from "react";
import { getOrders } from "../../services/orderService";

const SellerShipping = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getOrders();
        const greenOrders = (res.data || []).filter(order =>
          (order.orderItems || []).some(item => item.brand === 'green')
        );
        setOrders(greenOrders);
        setError("");
      } catch {
        setError("Cannot load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full border border-green-200 rounded-lg">
            <thead className="bg-green-100">
              <tr>
                <th className="py-2 px-3">Order ID</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Shipping Address</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Order Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-400">Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-6 text-gray-400">No orders</td></tr>
              ) : (
                orders.map((o, idx) => (
                  <tr key={o._id || idx} className="border-t border-green-50">
                    <td className="py-2 px-3 font-semibold text-green-700">{o._id}</td>
                    <td className="py-2 px-3">{o.shippingInfo?.name || o.shippingInfo?.phoneNo || 'Ẩn danh'}</td>
                    <td className="py-2 px-3">{o.shippingInfo?.address}, {o.shippingInfo?.city}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${o.orderStatus === 'Delivered' || o.orderStatus === 'Delivered' ? 'bg-green-200 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.orderStatus || 'Pending'}</span>
                    </td>
                    <td className="py-2 px-3">{o.createdAt?.slice(0,10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SellerShipping; 