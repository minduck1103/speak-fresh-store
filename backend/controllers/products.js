const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');
const fs = require('fs');
const upload = require('../middleware/upload');

// @desc    Get all products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private/Admin
exports.createProduct = [
  upload.single('image'),
  asyncHandler(async (req, res, next) => {
    // Xử lý dữ liệu từ FormData
    const { name, price, category, description, stock } = req.body;
    let imagePath = '';
    if (req.file) {
      imagePath = `/images/${req.file.filename}`;
    }
    const product = await Product.create({
      name,
      price,
      category,
      description,
      stock,
      image: imagePath
    });
    res.status(201).json({ success: true, data: product });
  })
];

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = [
  upload.single('image'),
  asyncHandler(async (req, res, next) => {
    console.log('DEBUG updateProduct - req.file:', req.file);
    console.log('DEBUG updateProduct - req.body:', req.body);
    
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }

    // Nếu có file ảnh mới thì xóa ảnh cũ và cập nhật ảnh mới
    if (req.file) {
      if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
        const oldPath = path.join(__dirname, '../../frontend/public', product.image);
        console.log('DEBUG updateProduct - oldPath:', oldPath);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      product.image = `/images/${req.file.filename}`;
      console.log('DEBUG updateProduct - new image path:', product.image);
    }

    // Cập nhật các trường khác
    const updateFields = ['name', 'price', 'category', 'description', 'stock'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();
    console.log('DEBUG updateProduct - saved product:', product);
    
    res.status(200).json({ success: true, data: product });
  })
];

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    // Xóa file ảnh nếu có và file tồn tại
    if (product.image && typeof product.image === 'string' && product.image.trim() !== '') {
        const imagePath = path.join(__dirname, '../../frontend/public', product.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Create new review
// @route   POST /api/v1/products/:id/reviews
// @access  Private
exports.createProductReview = asyncHandler(async (req, res, next) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
        review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
        return next(
            new ErrorResponse('Product already reviewed', 400)
        );
    }

    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user.id
    };

    product.reviews.push(review);

    // Update product rating
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();

    res.status(201).json({
        success: true,
        data: product
    });
});

// @desc    Get product reviews
// @route   GET /api/v1/products/:id/reviews
// @access  Public
exports.getProductReviews = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: product.reviews
    });
});

// @desc    Delete review
// @route   DELETE /api/v1/products/:id/reviews
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    // Filter out the review to be deleted
    product.reviews = product.reviews.filter(
        review => review.user.toString() !== req.user.id
    );

    // Update product rating
    product.ratings = product.reviews.length > 0
        ? product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length
        : 0;

    await product.save();

    res.status(200).json({
        success: true,
        data: product
    });
});

// @desc    Upload product image
// @route   PUT /api/v1/products/:id/image
// @access  Private/Admin
exports.uploadProductImage = [
  upload.single('image'),
  asyncHandler(async (req, res, next) => {
    console.log('DEBUG req.file:', req.file);
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
    }
    if (!req.file) {
      return next(new ErrorResponse('No image file uploaded', 400));
    }
    // Lưu đường dẫn tương đối để frontend dùng được
    const imagePath = `/images/${req.file.filename}`;
    // Nếu có ảnh cũ thì xóa file cũ (nếu muốn)
    if (product.image && product.image !== imagePath) {
      const oldPath = path.join(__dirname, '../../frontend/public', product.image);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    product.image = imagePath;
    await product.save();
    res.status(200).json({ success: true, data: product });
  })
]; 