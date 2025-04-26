import React, { useState, useEffect } from "react";

// Giả lập lấy thông tin user, thực tế sẽ lấy từ API hoặc context
const mockUser = {
  name: "Nguyễn Văn A",
  email: "user@email.com",
  phone: "0901234567",
  address: "123 Đường ABC, Quận 1, TP.HCM",
};

const EditAccount = () => {
  const [user, setUser] = useState(mockUser);
  const [form, setForm] = useState(user);
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setForm(user);
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gọi API cập nhật thông tin ở đây
    setUser(form);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div className="bg-green-50 min-h-screen py-10">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Chỉnh sửa thông tin tài khoản</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-green-700 font-semibold mb-1">Họ tên</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-green-700 font-semibold mb-1">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-green-700 font-semibold mb-1">Số điện thoại</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-green-700 font-semibold mb-1">Địa chỉ</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="block text-green-700 font-semibold mb-1">Mật khẩu mới (nếu muốn đổi)</label>
            <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors text-lg">Lưu thay đổi</button>
          {success && <div className="text-green-600 text-center font-semibold mt-2">Cập nhật thành công!</div>}
        </form>
      </div>
    </div>
  );
};

export default EditAccount; 