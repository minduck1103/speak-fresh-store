import React, { useState, useMemo } from 'react';
import ProductFilter from './ProductFilter';
import ProductSort from './ProductSort';
import ProductList from './ProductList';

const Products = ({ products: initialProducts }) => {
  // State for filters and sorting
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [sortOption, setSortOption] = useState('name-asc');

  // Get unique categories from products
  const categories = useMemo(() => {
    return [...new Set(initialProducts.map(product => product.category))];
  }, [initialProducts]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }

    // Apply price filter
    result = result.filter(product => {
      const finalPrice = product.discount 
        ? product.price * (1 - product.discount / 100) 
        : product.price;
      return finalPrice >= priceRange.min && finalPrice <= priceRange.max;
    });

    // Apply sorting
    result.sort((a, b) => {
      const getPrice = (product) => product.discount 
        ? product.price * (1 - product.discount / 100) 
        : product.price;

      switch (sortOption) {
        case 'price-asc':
          return getPrice(a) - getPrice(b);
        case 'price-desc':
          return getPrice(b) - getPrice(a);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [initialProducts, selectedCategories, priceRange, sortOption]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sản phẩm của chúng tôi</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <div className="lg:w-1/4">
          <ProductFilter
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            categories={categories}
          />
        </div>

        {/* Main content */}
        <div className="lg:w-3/4">
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Hiển thị {filteredAndSortedProducts.length} sản phẩm
            </p>
            <ProductSort
              sortOption={sortOption}
              setSortOption={setSortOption}
            />
          </div>

          <ProductList products={filteredAndSortedProducts} />
        </div>
      </div>
    </div>
  );
};

export default Products; 