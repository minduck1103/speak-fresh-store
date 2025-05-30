import React from "react";

const OrderList = ({ orders = [], onView, onUpdateStatus }) => {
  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2"><span role="img" aria-label="fruit">🍍</span> Order List</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg bg-white">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3">Order Date</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Total Amount</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6 text-gray-400">No orders</td></tr>
            ) : (
              orders.map((o, idx) => (
                <tr key={o._id || idx} className="border-t border-green-50">
                  <td className="py-2 px-3 font-semibold text-green-700">{o._id}</td>
                  <td className="py-2 px-3">{o.user?.name || 'Anonymous'}</td>
                  <td className="py-2 px-3">{o.createdAt?.slice(0,10)}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${o.status === 'Delivered' ? 'bg-green-200 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status || 'Pending'}</span>
                  </td>
                  <td className="py-2 px-3 text-green-600 font-bold">{o.totalPrice?.toLocaleString()}₫</td>
                  <td className="py-2 px-3 flex gap-2">
                    <button onClick={() => onView(o)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors">View</button>
                    <button onClick={() => onUpdateStatus(o)} className="bg-yellow-400 text-green-900 px-3 py-1 rounded hover:bg-yellow-500 transition-colors font-bold">Update status</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList; 