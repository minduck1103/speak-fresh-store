import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white py-4">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold">
            <span className="text-red-500">PEAK</span>
            <span className="text-orange-400">FRESH</span>
            <span className="text-green-500 ml-1">🍃</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-gray-900">
            Home
          </Link>
          <Link to="/products" className="text-gray-700 hover:text-gray-900">
            Products
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-gray-900">
            About
          </Link>
          <Link to="/shop" className="text-gray-700 hover:text-gray-900">
            Shop
          </Link>
          <Link to="/contacts" className="text-gray-700 hover:text-gray-900">
            Contacts
          </Link>
          <Link to="/cart" className="text-gray-700 hover:text-gray-900">
            🛒
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
