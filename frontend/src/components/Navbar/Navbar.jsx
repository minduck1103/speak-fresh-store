import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import authService from "../../services/authService";
import cartService from "../../services/cartService";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

const roleToHomePath = {
  admin: '/admin',
  seller: '/seller',
  delivery: '/delivery',
  warehouse: '/warehouse',
  user: '/',
};

const Navbar = () => {
  const { t } = useTranslation();

  const roleToLabel = {
    admin: t('roles.admin'),
    seller: t('roles.seller'),
    delivery: t('roles.delivery'),
    warehouse: t('roles.warehouse'),
    user: t('roles.user'),
  };
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [lastWarehousePath, setLastWarehousePath] = useState(null);

  useEffect(() => {
    const isAuth = authService.isAuthenticated();
    setIsAuthenticated(isAuth);
    if (isAuth) {
      setUserRole(authService.getUserRole() || 'user');
    }
    updateCartCount();

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount);
    window.addEventListener('storage', handleStorageChange);

    // Nếu đang ở các trang đặc biệt, lưu lại path
    if (["/warehouse", "/seller", "/admin", "/delivery"].some(prefix => location.pathname.startsWith(prefix))) {
      setLastWarehousePath(location.pathname);
    }

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

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

  const handleLogoClick = (e) => {
    e.preventDefault();
    const userRole = authService.getUserRole() || 'user';
    navigate(roleToHomePath[userRole]);
  };

  const handleHomeClick = (e) => {
    e.preventDefault();
    if (lastWarehousePath) {
      navigate(lastWarehousePath);
    } else {
      navigate('/');
    }
  };

  const renderDropdownMenu = () => {
    if (userRole === 'user') {
      return (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <Link
            to="/account/edit"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline"
            onClick={() => setShowDropdown(false)}
          >
            {t('user.account_info')}
          </Link>
          <Link
            to="/orders"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline"
            onClick={() => setShowDropdown(false)}
          >
            {t('user.order_management')}
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {t('user.logout')}
          </button>
        </div>
      );
    }

    return (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
        <div className="block px-4 py-2 text-sm font-medium text-green-600 border-b border-gray-200">
          {roleToLabel[userRole]}
        </div>
        <Link
          to="/account/edit"
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 no-underline"
          onClick={() => setShowDropdown(false)}
        >
          {t('user.account_info')}
        </Link>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          {t('user.logout')}
        </button>
      </div>
    );
  };

  return (
    <nav className="bg-white py-4 shadow-md border-b-2 border-green-100 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#" onClick={handleLogoClick} className="text-2xl font-bold no-underline">
            <span className="text-red-500">PEAK</span>
            <span className="text-orange-400">FRESH</span>
            <span className="text-green-500 ml-1">🍃</span>
          </a>
        </div>
        <div className="hidden md:flex items-center space-x-5">
          <Link
            to="/"
            className="text-gray-700 hover:text-green-500 transition-colors no-underline"
            onClick={handleHomeClick}
          >
            {t('navigation.home')}
          </Link>
          <Link
            to="/products"
            className="text-gray-700 hover:text-green-500 transition-colors no-underline"
          >
            {t('navigation.products')}
          </Link>
          <Link
            to="/about"
            className="text-gray-700 hover:text-green-500 transition-colors no-underline"
          >
            {t('navigation.about')}
          </Link>
          <Link
            to="/contacts"
            className="text-gray-700 hover:text-green-500 transition-colors no-underline"
          >
            {t('navigation.contact')}
          </Link>
          <Link
            to="/cart"
            onClick={handleCartClick}
            className="text-gray-700 hover:text-green-500 transition-colors flex items-center relative no-underline"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => {
                  // Nếu đang ở các trang đặc biệt thì luôn show dropdown
                  if (["/warehouse", "/seller", "/admin", "/delivery"].some(prefix => location.pathname.startsWith(prefix))) {
                    setShowDropdown(true);
                  } else {
                    setShowDropdown(!showDropdown);
                  }
                }}
                className="text-gray-700 hover:text-green-500 transition-colors flex items-center focus:outline-none"
              >
                👤
              </button>

              {showDropdown && renderDropdownMenu()}
            </div>
          ) : (
            <Link
              to="/login"
              className="text-gray-700 hover:text-green-500 transition-colors flex items-center no-underline"
            >
              👤
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
