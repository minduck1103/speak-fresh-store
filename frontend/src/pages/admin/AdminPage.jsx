import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminDashboard from "./AdminDashboard";
import AdminCustomers from "./AdminCustomers";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminShipping from "./AdminShipping";
import AdminReports from "./AdminReports";
import AdminSettings from "./AdminSettings";
import AdminReviews from "./AdminReviews";

const AdminPage = () => {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="bg-green-50 min-h-screen flex flex-col" style={{paddingTop: '80px'}}>
      <div>
        <div className="max-w-[1440px] w-full mx-auto px-2 md:px-8">
          <div className="flex">
      <AdminSidebar tab={tab} setTab={setTab} />
      <main className="flex-1 p-8 bg-white rounded-l-3xl shadow-lg" style={{paddingTop: '80px'}}>
        {tab === "dashboard" && <AdminDashboard />}
        {tab === "customers" && <AdminCustomers />}
        {tab === "products" && <AdminProducts />}
        {tab === "orders" && <AdminOrders />}
        {tab === "shipping" && <AdminShipping />}
        {tab === "reports" && <AdminReports />}
        {tab === "settings" && <AdminSettings />}
        {tab === "reviews" && <AdminReviews />}
      </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 