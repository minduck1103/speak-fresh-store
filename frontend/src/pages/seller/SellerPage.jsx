import React, { useState, useEffect } from "react";
import SellerDashboard from "./SellerDashboard";
import SellerOrderList from "./SellerOrderList";
import SellerProductList from "./SellerProductList";
import SellerCategoryList from "./SellerCategoryList";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import { getOrders } from "../../services/orderService";
import SellerSidebar from "./SellerSidebar";
import SellerShipping from "./SellerShipping";
import SellerReport from "./SellerReport";
import SellerProfile from "./SellerProfile";

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
    <div className="flex min-h-screen bg-green-50">
      <SellerSidebar tab={tab} setTab={setTab} />
      <main className="flex-1 p-8 bg-white rounded-l-3xl shadow-lg">
        {tab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">📊 Tổng quan</h2>
            <SellerDashboard orderCount={orderCount} revenue={revenue} />
          </div>
        )}
        {tab === "products" && (
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">🍏 Sản phẩm của tôi</h2>
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
          </div>
        )}
        {tab === "orders" && (
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">🧾 Đơn hàng</h2>
            <SellerOrderList orders={orders} />
          </div>
        )}
        {tab === "shipping" && (
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">🚚 Vận chuyển</h2>
            <SellerShipping />
          </div>
        )}
        {tab === "report" && (
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">📈 Báo cáo</h2>
            <SellerReport />
          </div>
        )}
        {tab === "profile" && (
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">🏪 Hồ sơ cửa hàng</h2>
            <SellerProfile />
          </div>
        )}
      </main>
    </div>
  );
};

export default SellerPage; 