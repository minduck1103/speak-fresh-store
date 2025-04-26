import React, { useState } from "react";
import AdminDashboard from "./AdminDashboard";
import CustomerList from "./CustomerList";
import OrderList from "./OrderList";

const mockAccounts = 123;
const mockNewOrders = 7;
const mockCustomers = [
  { _id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "user", active: true },
  { _id: 2, name: "Trần Thị B", email: "b@gmail.com", role: "seller", active: false },
];
const mockOrders = [
  { _id: 1, user: { name: "Nguyễn Văn A" }, createdAt: "2024-04-25T10:00:00Z", status: "Đang xử lý", totalPrice: 250000 },
  { _id: 2, user: { name: "Trần Thị B" }, createdAt: "2024-04-24T09:00:00Z", status: "Đã giao", totalPrice: 500000 },
];

const AdminPage = () => {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex gap-4 justify-center mb-8">
          <button onClick={() => setTab("dashboard")} className={`px-6 py-2 rounded-full font-bold border-2 transition-colors ${tab === "dashboard" ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}>Dashboard</button>
          <button onClick={() => setTab("customers")} className={`px-6 py-2 rounded-full font-bold border-2 transition-colors ${tab === "customers" ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}>Khách hàng</button>
          <button onClick={() => setTab("orders")} className={`px-6 py-2 rounded-full font-bold border-2 transition-colors ${tab === "orders" ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}>Đơn hàng</button>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {tab === "dashboard" && <AdminDashboard accountCount={mockAccounts} newOrderCount={mockNewOrders} />}
          {tab === "customers" && <CustomerList customers={mockCustomers} onView={() => {}} onToggleActive={() => {}} />}
          {tab === "orders" && <OrderList orders={mockOrders} onView={() => {}} onUpdateStatus={() => {}} />}
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 