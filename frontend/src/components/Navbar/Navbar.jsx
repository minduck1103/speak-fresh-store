import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-red-500">PEAK</span>
            <span className="text-orange-400">FRESH</span>
            <span className="text-green-500 ml-1">🍃</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-green-500 transition-colors"
          >
            <span className="text-xl">🏠</span>
            <span className="ml-1">Trang chủ</span>
          </Link>
          <Link 
            to="/products" 
            className="text-gray-700 hover:text-green-500 transition-colors"
          >
            <span className="text-xl">📦</span>
            <span className="ml-1">Sản phẩm</span>
          </Link>
          <Link 
            to="/about" 
            className="text-gray-700 hover:text-green-500 transition-colors"
          >
            <span className="text-xl">💬</span>
            <span className="ml-1">Giới thiệu</span>
          </Link>
          <Link 
            to="/contacts" 
            className="text-gray-700 hover:text-green-500 transition-colors"
          >
            <span className="text-xl">☎️</span>
            <span className="ml-1">Liên hệ</span>
          </Link>
          <Link 
            to="/cart" 
            className="text-gray-700 hover:text-green-500 transition-colors flex items-center"
          >
            <span className="text-xl">🛒</span>
            <span className="ml-1">Giỏ hàng</span>
          </Link>
          <Link 
            to="/login" 
            className="text-gray-700 hover:text-green-500 transition-colors flex items-center"
          >
            <span className="text-xl">👤</span>
            <span className="ml-1">Tài khoản</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
