import React, { useState } from "react";
import api from "../../services/api";
import PropTypes from 'prop-types';

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'waiting_pickup', label: 'Waiting Pickup' },
  { value: 'delivering', label: 'Delivering' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'failed', label: 'Failed' },
];

const DeliveryOrderList = ({ orders = [], confirmMode = false, onReloadOrders }) => {
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleConfirmPickup = async (id) => {
    setUpdating(true);
    try {
      await api.put(`/api/v1/orders/${id}/delivery-confirm`);
      setSuccessMsg("Confirmed pickup!");
      if (onReloadOrders) onReloadOrders();
    } catch {
      setSuccessMsg("Cannot confirm pickup!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkDelivered = async (id) => {
    setUpdating(true);
    try {
      await api.put(`/api/v1/orders/${id}/delivered`);
      setSuccessMsg("Updated status: Delivered!");
      if (onReloadOrders) onReloadOrders();
    } catch {
      setSuccessMsg("Cannot update status!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkFailed = async (id) => {
    setUpdating(true);
    try {
      await api.put(`/api/v1/orders/${id}/failed`);
      setSuccessMsg("Updated status: Failed!");
      if (onReloadOrders) onReloadOrders();
    } catch {
      setSuccessMsg("Cannot update status!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } finally {
      setUpdating(false);
    }
  };

  const filteredOrders = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2"><span role="img" aria-label="fruit">🍊</span> Order Management</h2>
      <div className="flex items-center gap-3 mb-4">
        <label className="font-semibold text-green-700">Filter by status:</label>
        <select
          className="border border-green-300 rounded px-3 py-2 focus:outline-none focus:border-green-500"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg bg-white">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-3">Order ID</th>
              <th className="py-2 px-3">Customer</th>
              <th className="py-2 px-3">Order date</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Total amount</th>
              <th className="py-2 px-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-6 text-gray-400">No orders</td></tr>
            ) : (
              filteredOrders.map((o, idx) => (
                <tr key={o._id || idx} className="border-t border-green-50">
                  <td className="py-2 px-3 font-semibold text-green-700">{o._id}</td>
                  <td className="py-2 px-3">{o.shippingInfo?.name || 'Ẩn danh'}</td>
                  <td className="py-2 px-3">{o.createdAt?.slice(0,10)}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      o.status === 'delivered' ? 'bg-green-200 text-green-700' :
                      o.status === 'delivering' ? 'bg-blue-100 text-blue-700' :
                      o.status === 'failed' ? 'bg-red-100 text-red-600' :
                      o.status === 'waiting_pickup' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{o.status || 'pending'}</span>
                  </td>
                  <td className="py-2 px-3 text-green-600 font-bold">{o.totalAmount?.toLocaleString()}₫</td>
                  <td className="py-2 px-3 flex gap-2">
                    {confirmMode ? (
                      <button onClick={() => handleConfirmPickup(o._id)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors" disabled={updating}>Confirm pickup</button>
                    ) : o.status === 'delivering' ? (
                      <>
                        <button onClick={() => handleMarkDelivered(o._id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors" disabled={updating}>Delivered</button>
                        <button onClick={() => handleMarkFailed(o._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors" disabled={updating}>Failed</button>
                      </>
                    ) : null}
                    <button onClick={() => setSelected(o)} className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition-colors">View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{backdropFilter: 'blur(6px)'}}>
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border-2 border-green-200">
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-gray-400 hover:text-green-600 text-3xl font-bold">×</button>
            <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">Order detail</h2>
            <div className="mb-3 flex flex-col md:flex-row md:justify-between gap-2">
              <div className="text-gray-700">Order ID: <span className="font-semibold text-green-700">{selected._id}</span></div>
              <div className="text-gray-700">Order date: <span className="font-semibold">{selected.createdAt?.slice(0,10)}</span></div>
            </div>
            <div className="mb-3 text-gray-700">Status: <span className={`font-bold px-2 py-1 rounded ${selected.status === 'Delivered' ? 'bg-green-200 text-green-700' : selected.status === 'Delivering' ? 'bg-blue-100 text-blue-700' : selected.status === 'Failed' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>{selected.status || 'Pending'}</span></div>
            <div className="mb-3 text-gray-700">Total amount: <span className="font-bold text-2xl text-green-600">{selected.totalAmount?.toLocaleString()}₫</span></div>
            <div className="mb-3 text-gray-700">Customer information:</div>
            <div className="mb-4 bg-green-50 rounded-lg p-3 border border-green-100">
              <div><span className="font-semibold">Name:</span> {selected.shippingInfo?.name}</div>
              <div><span className="font-semibold">Phone:</span> {selected.shippingInfo?.phoneNo}</div>
              <div><span className="font-semibold">Address:</span> {selected.shippingInfo?.address}, {selected.shippingInfo?.city}</div>
            </div>
            <div className="mb-2 text-gray-700 font-semibold">Products:</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-green-100 rounded-lg mb-4">
                <thead className="bg-green-100">
                  <tr>
                    <th className="py-2 px-2">Name</th>
                    <th className="py-2 px-2">Quantity</th>
                    <th className="py-2 px-2">Price</th>
                    <th className="py-2 px-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.items || []).map((item, idx) => (
                    <tr key={idx} className="border-t border-green-50">
                      <td className="py-2 px-2 font-semibold text-green-700">{item.name}</td>
                      <td className="py-2 px-2 text-center">{item.quantity}</td>
                      <td className="py-2 px-2">{item.price?.toLocaleString()}₫</td>
                      <td className="py-2 px-2 font-bold">{(item.price * item.quantity).toLocaleString()}₫</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={() => setSelected(null)} className="w-full mt-2 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

DeliveryOrderList.propTypes = {
  orders: PropTypes.array,
  confirmMode: PropTypes.bool,
  onReloadOrders: PropTypes.func
};

export default DeliveryOrderList; 