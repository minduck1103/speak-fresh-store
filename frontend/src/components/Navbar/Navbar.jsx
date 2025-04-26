import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import authService from "../../services/authService";
import cartService from "../../services/cartService";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleStorageChange = (e) => {
    if (e.key === 'cart_items') {
      updateCartCount();
    }
  };

  const updateCartCount = () => {
    setCartCount(cartService.getItemsCount());
  };

  const handleLogout = () => {
    authService.logout();
    cartService.clearCart(); // Clear cart on logout
    setIsAuthenticated(false);
    setShowDropdown(false);
    setCartCount(0);
    navigate('/login');
  };

  const handleCartClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login', { state: { from: '/cart' } });
    }
  };

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
            onClick={handleCartClick}
            className="text-gray-700 hover:text-green-500 transition-colors flex items-center relative"
          >
            <span className="text-xl">🛒</span>
            <span className="ml-1">Giỏ hàng</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-gray-700 hover:text-green-500 transition-colors flex items-center focus:outline-none"
              >
                <span className="text-xl">👤</span>
                <span className="ml-1">Tài khoản</span>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="mr-2">👤</span>
                    Thông tin tài khoản
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="mr-2">📦</span>
                    Quản lý đơn hàng
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span className="mr-2">🚪</span>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login" 
              className="text-gray-700 hover:text-green-500 transition-colors flex items-center"
            >
              <span className="text-xl">👤</span>
              <span className="ml-1">Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
