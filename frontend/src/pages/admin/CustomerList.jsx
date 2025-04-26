import React from "react";

const CustomerList = ({ customers = [], onView, onToggleActive }) => {
  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2"><span role="img" aria-label="fruit">🍊</span> Danh sách khách hàng</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-green-200 rounded-lg bg-white">
          <thead className="bg-green-100">
            <tr>
              <th className="py-2 px-3">Tên</th>
              <th className="py-2 px-3">Email</th>
              <th className="py-2 px-3">Loại</th>
              <th className="py-2 px-3">Trạng thái</th>
              <th className="py-2 px-3">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-6 text-gray-400">Không có khách hàng</td></tr>
            ) : (
              customers.map((c, idx) => (
                <tr key={c._id || idx} className="border-t border-green-50">
                  <td className="py-2 px-3 font-semibold text-green-700">{c.name}</td>
                  <td className="py-2 px-3">{c.email}</td>
                  <td className="py-2 px-3">{c.role === 'seller' ? 'Người bán' : 'Khách hàng'}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.active ? 'bg-green-200 text-green-700' : 'bg-red-100 text-red-600'}`}>{c.active ? 'Active' : 'Deactive'}</span>
                  </td>
                  <td className="py-2 px-3 flex gap-2">
                    <button onClick={() => onView(c)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors">Xem</button>
                    <button onClick={() => onToggleActive(c)} className={`px-3 py-1 rounded font-bold ${c.active ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-green-500 text-white hover:bg-green-600'}`}>{c.active ? 'Deactive' : 'Active'}</button>
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

export default CustomerList; 