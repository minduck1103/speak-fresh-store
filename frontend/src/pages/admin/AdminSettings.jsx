import React, { useState } from "react";

const AdminSettings = () => {
  const [siteName, setSiteName] = useState("PEAKFRESH");
  const [email, setEmail] = useState("admin@peakfresh.com");
  const [logo, setLogo] = useState(null);

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">⚙️ Settings</h1>
      <form className="bg-white rounded-xl shadow p-6 max-w-xl">
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-1">Tên trang web</label>
          <input value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
        </div>
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-1">Email liên hệ</label>
          <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
        </div>
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-1">Logo</label>
          <input type="file" onChange={e => setLogo(e.target.files[0])} className="w-full" />
          {logo && <img src={URL.createObjectURL(logo)} alt="Logo preview" className="w-24 h-24 object-cover rounded mt-2" />}
        </div>
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-1">Shipping Configuration</label>
          <input className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" placeholder="Ví dụ: Miễn phí cho đơn > 500k" />
        </div>
        <div className="mb-4">
          <label className="block text-green-700 font-semibold mb-1">Quản lý banner/slider trang chủ</label>
          <input type="file" className="w-full" />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg">Save</button>
      </form>
    </div>
  );
};

export default AdminSettings;