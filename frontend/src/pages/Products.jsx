import React, { useState, useMemo } from 'react';
import ProductFilter from '../components/Products/ProductFilter';
import ProductList from '../components/Products/ProductList';
import ProductSort from '../components/Products/ProductSort';
import ProductSearch from '../components/Products/ProductSearch';

const Products = () => {
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('name-asc');

  // Danh sách sản phẩm mẫu
  const products = [
    {
      id: 1,
      name: "Táo Envy New Zealand",
      price: 189000,
      category: "táo",
      origin: "New Zealand",
      image: "/src/assets/products/apple-envy.png",
      description: "Táo Envy có vỏ màu đỏ thẫm, thịt giòn, ngọt đậm",
      discount: 0,
    },
    {
      id: 2,
      name: "Cam Valencia Úc",
      price: 159000,
      category: "cam",
      origin: "Úc",
      image: "/src/assets/products/orange-valencia.png",
      description: "Cam Valencia vỏ mỏng, nhiều nước, vị ngọt thanh",
      discount: 10,
    },
    {
      id: 3,
      name: "Nho xanh không hạt Úc",
      price: 239000,
      category: "nho",
      origin: "Úc",
      image: "/src/assets/products/grape-green.png",
      description: "Nho xanh không hạt, vị ngọt đậm, giòn",
      discount: 0,
    },
    {
      id: 4,
      name: "Lê Singo Hàn Quốc",
      price: 209000,
      category: "lê",
      origin: "Hàn Quốc",
      image: "/src/assets/products/pear-singo.png",
      description: "Lê Singo thịt trắng, giòn ngọt, mọng nước",
      discount: 15,
    },
    {
      id: 5,
      name: "Kiwi vàng New Zealand",
      price: 179000,
      category: "kiwi",
      origin: "New Zealand",
      image: "/src/assets/products/kiwi-gold.png",
      description: "Kiwi vàng thịt vàng óng, vị ngọt đặc trưng",
      discount: 0,
    },
    {
      id: 6,
      name: "Cherry đỏ Mỹ",
      price: 499000,
      category: "cherry",
      origin: "Mỹ",
      image: "/src/assets/products/cherry-red.png",
      description: "Cherry đỏ tươi, thịt chắc, vị ngọt chua",
      discount: 20,
    },
  ];

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(products.map(product => product.category))];
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

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
  }, [products, selectedCategories, priceRange, sortOption, searchQuery]);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sản Phẩm</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <ProductFilter 
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
            />
          </div>

          {/* Product List */}
          <div className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <ProductSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <ProductSort sortOption={sortOption} setSortOption={setSortOption} />
            </div>
            <ProductList products={filteredAndSortedProducts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products; 