import React, { useState, useEffect } from "react";
import SellerDashboard from "./SellerDashboard";
import SellerOrderList from "./SellerOrderList";
import SellerProductList from "./SellerProductList";
import SellerCategoryList from "./SellerCategoryList";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import { getOrders } from "../../services/orderService";

const SellerPage = () => {
  const [tab, setTab] = useState("dashboard");
  const [subTab, setSubTab] = useState("products"); // tab con: "products" hoặc "categories"
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      const orderList = res.data || [];
      setOrders(orderList);
      setOrderCount(orderList.length);
      setRevenue(orderList.reduce((sum, o) => sum + (o.totalPrice || 0), 0));
    } catch (err) {
      setError("Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "dashboard" || tab === "orders") {
      fetchOrders();
    }
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
          {tab === "dashboard" && <SellerDashboard orderCount={orderCount} revenue={revenue} />}
          {tab === "orders" && <SellerOrderList orders={orders} />}
          {tab === "products" && (
            <>
              {/* Tab con */}
              <div className="flex gap-4 mb-6">
                <button
                  onClick={() => setSubTab("products")}
                  className={`px-5 py-2 rounded-full font-bold border-2 transition-colors ${subTab === "products" ? "bg-green-500 text-white border-green-500" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}
                >
                  Quản lý sản phẩm
                </button>
                <button
                  onClick={() => setSubTab("categories")}
                  className={`px-5 py-2 rounded-full font-bold border-2 transition-colors ${subTab === "categories" ? "bg-green-500 text-white border-green-500" : "bg-white text-green-700 border-green-300 hover:bg-green-100"}`}
                >
                  Quản lý danh mục
                </button>
              </div>
              {subTab === "products" && <SellerProductList />}
              {subTab === "categories" && (
                <SellerCategoryList
                  categories={categories}
                  onReloadCategories={fetchCategories}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerPage; 