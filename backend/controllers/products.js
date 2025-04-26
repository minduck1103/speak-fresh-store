const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

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
exports.createProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        data: product
    });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorResponse(`Product not found with id of ${req.params.id}`, 404)
        );
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: product
    });
});

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

    await product.remove();

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