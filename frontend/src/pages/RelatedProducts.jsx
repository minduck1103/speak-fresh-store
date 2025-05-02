import React, { useEffect, useState } from "react";
import productService from "../services/productService";
import { Link } from "react-router-dom";

const RelatedProducts = ({ currentProduct }) => {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await productService.getProducts();
      const all = res.data || res;
      const filtered = all.filter(
        (p) =>
          (p.category === currentProduct.category || p.category?._id === currentProduct.category?._id) &&
          p._id !== currentProduct._id
      );
      setRelated(filtered.slice(0, 4));
    };
    fetch();
  }, [currentProduct]);

  if (!related.length) return null;

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-green-700 mb-6">Sản phẩm liên quan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((product) => (
          <Link to={`/products/${product._id}`} key={product._id} className="block bg-white rounded-xl shadow p-4 hover:shadow-lg transition no-underline">
            <img
              src={product.image || (product.images && (product.images[0]?.url || product.images[0])) || '/no-image.png'}
              alt={product.name}
              className="w-full h-40 object-contain rounded mb-3 bg-white"
            />
            <h3 className="text-base font-bold text-green-700 line-clamp-2 mb-1">{product.name}</h3>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < (product.ratings || 0) ? '' : 'text-gray-300'}`}></i>
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.reviews?.length || 0} đánh giá)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-green-600">{product.price?.toLocaleString()}₫</span>
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts; 