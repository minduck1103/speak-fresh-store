// Product Translation Service
// Maps Vietnamese product data to English translations

const productTranslations = {
  // Fruits
  "Táo Fuji Nhật Bản": {
    en: "Japanese Fuji Apple"
  },
  "Cam Sành Hòa Bình": {
    en: "Hoa Binh Sweet Orange"
  },
  "Nho Đen Không Hạt": {
    en: "Seedless Black Grapes"
  },
  "Dưa Hấu Không Hạt": {
    en: "Seedless Watermelon"
  },
  "Xoài Cát Chu": {
    en: "Cat Chu Mango"
  },
  "Bưởi Da Xanh": {
    en: "Green Skin Pomelo"
  },
  "Dâu Tây Đà Lạt": {
    en: "Dalat Strawberry"
  },
  "Kiwi Xanh New Zealand": {
    en: "New Zealand Green Kiwi"
  },
  "Lê Hàn Quốc": {
    en: "Korean Pear"
  },
  "Chuối Tiêu Hữu Cơ": {
    en: "Organic Banana"
  },

  // Categories
  "Trái cây tươi": {
    en: "Fresh Fruits"
  },
  "Trái cây nhập khẩu": {
    en: "Imported Fruits"
  },
  "Trái cây hữu cơ": {
    en: "Organic Fruits"
  },
  "Trái cây sấy khô": {
    en: "Dried Fruits"
  },

  // Brands
  "PEAKFRESH": {
    en: "PEAKFRESH"
  },
  "Organic Valley": {
    en: "Organic Valley"
  },
  "Fresh Garden": {
    en: "Fresh Garden"
  }
};

const descriptionTranslations = {
  // Common descriptions
  "Táo Fuji nhập khẩu từ Nhật Bản, ngọt mát, giòn tan": {
    en: "Imported Japanese Fuji apple, sweet and crispy"
  },
  "Cam sành Hòa Bình ngọt thanh, nhiều nước": {
    en: "Sweet and juicy Hoa Binh orange"
  },
  "Nho đen không hạt, ngọt tự nhiên": {
    en: "Seedless black grapes, naturally sweet"
  },
  "Dưa hấu không hạt, thịt đỏ ngọt mát": {
    en: "Seedless watermelon with sweet red flesh"
  },
  "Xoài cát chu ngọt đậm đà, thơm nức": {
    en: "Cat Chu mango with rich sweetness and aroma"
  },
  "Bưởi da xanh múi to, ngọt thanh": {
    en: "Green skin pomelo with large segments, refreshingly sweet"
  },
  "Dâu tây Đà Lạt tươi ngon, giàu vitamin C": {
    en: "Fresh Dalat strawberries, rich in vitamin C"
  },
  "Kiwi xanh New Zealand, chua ngọt hài hòa": {
    en: "New Zealand green kiwi, perfectly balanced sweet and sour"
  },
  "Lê Hàn Quốc giòn ngọt, nhiều nước": {
    en: "Korean pear, crispy sweet and juicy"
  },
  "Chuối tiêu hữu cơ, ngọt tự nhiên": {
    en: "Organic banana, naturally sweet"
  }
};

const attributeTranslations = {
  // Stock status
  "Còn hàng": {
    en: "In Stock"
  },
  "Hết hàng": {
    en: "Out of Stock"
  },
  "Sắp hết": {
    en: "Low Stock"
  },

  // Quality levels
  "Cao cấp": {
    en: "Premium"
  },
  "Thường": {
    en: "Standard"
  },
  "Hữu cơ": {
    en: "Organic"
  },

  // Origins
  "Việt Nam": {
    en: "Vietnam"
  },
  "Nhật Bản": {
    en: "Japan"
  },
  "Hàn Quốc": {
    en: "South Korea"
  },
  "New Zealand": {
    en: "New Zealand"
  },
  "Úc": {
    en: "Australia"
  },
  "Mỹ": {
    en: "USA"
  }
};

class ProductTranslationService {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'vi';
  }

  setLanguage(language) {
    this.currentLanguage = language;
  }

  translateProductName(vietnameseName) {
    if (this.currentLanguage === 'vi') {
      return vietnameseName;
    }
    
    return productTranslations[vietnameseName]?.en || vietnameseName;
  }

  translateDescription(vietnameseDescription) {
    if (this.currentLanguage === 'vi') {
      return vietnameseDescription;
    }
    
    return descriptionTranslations[vietnameseDescription]?.en || vietnameseDescription;
  }

  translateAttribute(vietnameseAttribute) {
    if (this.currentLanguage === 'vi') {
      return vietnameseAttribute;
    }
    
    return attributeTranslations[vietnameseAttribute]?.en || vietnameseAttribute;
  }

  translateCategory(vietnameseCategory) {
    if (this.currentLanguage === 'vi') {
      return vietnameseCategory;
    }
    
    return productTranslations[vietnameseCategory]?.en || vietnameseCategory;
  }

  translateBrand(vietnameseBrand) {
    if (this.currentLanguage === 'vi') {
      return vietnameseBrand;
    }
    
    return productTranslations[vietnameseBrand]?.en || vietnameseBrand;
  }

  // Translate entire product object
  translateProduct(product) {
    if (this.currentLanguage === 'vi') {
      return product;
    }

    return {
      ...product,
      name: this.translateProductName(product.name),
      description: this.translateDescription(product.description),
      brand: this.translateBrand(product.brand),
      category: product.category ? {
        ...product.category,
        name: this.translateCategory(product.category.name)
      } : product.category
    };
  }

  // Translate array of products
  translateProducts(products) {
    return products.map(product => this.translateProduct(product));
  }
}

export default new ProductTranslationService();
