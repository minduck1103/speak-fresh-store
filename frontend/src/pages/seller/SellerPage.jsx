import { useState, useEffect } from "react";
import SellerDashboard from "./SellerDashboard";
import SellerOrderList from "./SellerOrderList";
import SellerProductList from "./SellerProductList";
import SellerCategoryList from "./SellerCategoryList";
// import productService from "../../services/productService"; // Không dùng
import categoryService from "../../services/categoryService";
import { getOrders } from "../../services/orderService";
import SellerSidebar from "./SellerSidebar";
import SellerShipping from "./SellerShipping";
import SellerReport from "./SellerReport";
import SellerProfile from "./SellerProfile";
import Footer from "../../components/Footer/Footer";

const SellerPage = () => {
  const [tab, setTab] = useState("dashboard");
  const [subTab, setSubTab] = useState("products"); // tab con: "products" hoặc "categories"
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const fetchProducts = async () => {
    try {
      // const res = await productService.getProducts(); // Không dùng res
    } catch (err) {
      // setError("Không thể tải sản phẩm"); // Không dùng error
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategories();
      setCategories(res.data || res);
    } catch (err) {
      // setError("Không thể tải danh mục"); // Không dùng error
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await getOrders();
      const orderList = res.data || [];
      setOrders(orderList);
      setOrderCount(orderList.length);
      setRevenue(orderList.reduce((sum, o) => sum + (o.totalPrice || 0), 0));
    } catch (err) {
      // setError("Không thể tải đơn hàng"); // Không dùng error
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
    <div className="bg-green-50 flex flex-col">
      <div>
        <div className="max-w-[1440px] w-full mx-auto px-2 md:px-8">
          <div className="flex">
      <SellerSidebar tab={tab} setTab={setTab} />
            <main className="p-8 bg-white rounded-l-3xl shadow-lg w-full">
        {tab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">📊 Tổng quan</h2>
            <SellerDashboard orderCount={orderCount} revenue={revenue} />
          </div>
        )}
        {tab === "products" && (
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">🍏 Sản phẩm</h2>
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
            <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center gap-2">🏪 Hồ sơ</h2>
            <SellerProfile />
          </div>
        )}
      </main>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SellerPage; 