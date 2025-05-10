import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cartService from '../services/cartService';
import authService from '../services/authService';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login', { state: { from: '/cart' } });
      return;
    }
    
    updateCart();
  }, [navigate]);

  const updateCart = () => {
    const items = cartService.getCartItems();
    setCartItems(items);
    setTotal(cartService.getCartTotal());
  };

  const handleQuantityChange = (productId, newQuantity) => {
    cartService.updateQuantity(productId, newQuantity);
    updateCart();
  };

  const handleRemoveItem = (productId) => {
    cartService.removeFromCart(productId);
    updateCart();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <span className="text-6xl">🛒</span>
          <h2 className="text-2xl font-semibold mt-4 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-4">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-32 mb-44" >
      <h1 className="text-2xl font-bold mb-8 text-gray-800">Giỏ hàng của bạn</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            {cartItems.map((item) => {
              const itemTotal = item.price * (1 - item.discount / 100) * item.quantity;
              
              return (
                <div 
                  key={item.productId}
                  className="flex items-center p-4 border-b border-gray-100 last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-grow ml-4">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <div className="flex items-center mt-2">
                      <div className="text-green-600 font-medium">
                        {formatPrice(item.price * (1 - item.discount / 100))}
                      </div>
                      {item.discount > 0 && (
                        <div className="ml-2 text-sm text-gray-400 line-through">
                          {formatPrice(item.price)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:text-green-500 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:text-green-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="ml-4 text-green-600 font-medium w-24 text-right">
                      {formatPrice(itemTotal)}
                    </div>
                    
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="ml-4 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ❌
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Tổng đơn hàng</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Tiến hành thanh toán
            </button>
            
            <button
              onClick={() => navigate('/products')}
              className="w-full mt-4 text-green-500 hover:text-green-600 transition-colors"
            >
              ← Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 