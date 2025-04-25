import React from 'react';

const ProductSort = ({ sortOption, setSortOption }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-gray-600 whitespace-nowrap">
        Sắp xếp theo:
      </label>
      <select
        id="sort"
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="name-asc">Tên A-Z</option>
        <option value="name-desc">Tên Z-A</option>
        <option value="price-asc">Giá tăng dần</option>
        <option value="price-desc">Giá giảm dần</option>
      </select>
    </div>
  );
};

export default ProductSort; 