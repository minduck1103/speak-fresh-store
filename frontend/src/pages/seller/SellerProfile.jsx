import React, { useState, useRef } from "react";

const initialProfile = {
  storeName: "Green Fruit Store",
  address: "123 Fruit Street, District 1, HCM City",
  phone: "0901234567",
  email: "greenfruit@example.com",
  description: "Specializing in fresh, safe, and high-quality fruits.",
  logo: null
};

const SellerProfile = () => {
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("sellerProfile");
    return saved ? JSON.parse(saved) : initialProfile;
  });
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [logoPreview, setLogoPreview] = useState(profile.logo);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogoPreview(ev.target.result);
        setProfile(p => ({ ...p, logo: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditing(false);
    setSuccess("Update information successfully!");
    localStorage.setItem("sellerProfile", JSON.stringify(profile));
    setTimeout(() => setSuccess(""), 2000);
  };

  return (
    <div className="bg-green-50 min-h-screen py-10 px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-xl mx-auto">
        {success && <div className="text-green-600 text-center font-bold mb-4">{success}</div>}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-28 h-28 mb-2">
            <img
              src={logoPreview || "/no-logo.png"}
              alt="Store Logo"
              className="w-28 h-28 object-cover rounded-full border-4 border-green-200 shadow"
            />
            {editing && (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-2 right-2 bg-green-600 text-white rounded-full p-2 shadow hover:bg-green-700"
                title="Select new logo"
              >
                <i className="fas fa-camera"></i>
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleLogoChange}
            />
          </div>
        </div>
        {!editing ? (
          <div>
            <div className="mb-4"><span className="font-bold text-green-700">Store Name:</span> {profile.storeName}</div>
            <div className="mb-4"><span className="font-bold text-green-700">Address:</span> {profile.address}</div>
            <div className="mb-4"><span className="font-bold text-green-700">Phone:</span> {profile.phone}</div>
            <div className="mb-4"><span className="font-bold text-green-700">Email:</span> {profile.email}</div>
            <div className="mb-4"><span className="font-bold text-green-700">Description:</span> {profile.description}</div>
            <button onClick={() => setEditing(true)} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-bold">Edit</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-green-700 font-semibold mb-1">Store Name</label>
              <input name="storeName" value={profile.storeName} onChange={handleChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-green-700 font-semibold mb-1">Address</label>
              <input name="address" value={profile.address} onChange={handleChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-green-700 font-semibold mb-1">Phone</label>
              <input name="phone" value={profile.phone} onChange={handleChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-green-700 font-semibold mb-1">Email</label>
              <input name="email" value={profile.email} onChange={handleChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
            </div>
            <div>
              <label className="block text-green-700 font-semibold mb-1">Store Description</label>
              <textarea name="description" value={profile.description} onChange={handleChange} className="w-full border border-green-300 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" rows={3} />
            </div>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setEditing(false)} className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 font-bold">Cancel</button>
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold">Save</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellerProfile; 