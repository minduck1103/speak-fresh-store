import React, { useState, useEffect } from "react";
import SellerDashboard from "./SellerDashboard";
import SellerOrderList from "./SellerOrderList";
import SellerProductList from "./SellerProductList";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";

const mockOrderCount = 12;
const mockRevenue = 15000000;
const mockOrders = [
  { _id: 1, customer: { name: "Nguyễn Văn A", phoneNo: "0123456789", address: "123 Đường A", city: "Hà Nội" }, createdAt: "2024-04-25T10:00:00Z", status: "Đang xử lý", totalPrice: 250000, items: [ { name: "Táo", quantity: 2, price: 50000 }, { name: "Chuối", quantity: 3, price: 50000 } ] },
  { _id: 2, customer: { name: "Trần Thị B", phoneNo: "0987654321", address: "456 Đường B", city: "HCM" }, createdAt: "2024-04-24T09:00:00Z", status: "Đã giao", totalPrice: 500000, items: [ { name: "Cam", quantity: 5, price: 100000 } ] },
];

const SellerPage = () => {
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productService.getProducts();
      setProducts(res.data || res);
    } catch (err) {
      setError("Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories();
      setCategories(res.data || res);
    } catch (err) {
      setError("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "products") {
      fetchProducts();
      fetchCategories();
    }
  }, [tab]);

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex gap-4 justify-center mb-8">
          <button onClick={() => setTab("dashboard")} className={`px-6 py-2 rounded-full font-bold border-2 transition-colors ${tab === "dashboard" ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}>Dashboard</button>
          <button onClick={() => setTab("orders")} className={`px-6 py-2 rounded-full font-bold border-2 transition-colors ${tab === "orders" ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}>Đơn hàng</button>
          <button onClick={() => setTab("products")} className={`px-6 py-2 rounded-full font-bold border-2 transition-colors ${tab === "products" ? "bg-green-600 text-white border-green-600" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}>Sản phẩm & Danh mục</button>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          {tab === "dashboard" && <SellerDashboard orderCount={mockOrderCount} revenue={mockRevenue} />}
          {tab === "orders" && <SellerOrderList orders={mockOrders} />}
          {tab === "products" && (
            <SellerProductList
              products={products}
              categories={categories}
              onReloadProducts={fetchProducts}
              onReloadCategories={fetchCategories}
              loading={loading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerPage; 