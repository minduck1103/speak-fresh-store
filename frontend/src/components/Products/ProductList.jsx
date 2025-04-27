import React from 'react';

const ProductList = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div className="relative h-48">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount > 0 && (
              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm">
                -{product.discount}%
              </div>
            )}
          </div>
          
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{product.category}</p>
            
            <div className="flex items-center justify-between mb-2">
              <div>
                {product.discount > 0 ? (
                  <>
                    <span className="text-lg font-bold text-primary">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(product.price * (1 - product.discount / 100))}
                    </span>
                    <span className="text-sm text-gray-400 line-through ml-2">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-primary">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(product.price)}
                  </span>
                )}
                <span className={`ml-2 px-2 py-1 text-xs rounded-full font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                </span>
              </div>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors w-full mt-2">
              Thêm
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList; 