const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Lấy tất cả đánh giá
// @route   GET /api/v1/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    const reviews = await Review.find();
    
    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
});

// @desc    Lấy đánh giá theo ID
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
        return next(new ErrorResponse(`Không tìm thấy đánh giá với ID ${req.params.id}`, 404));
    }
    
    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc    Tạo đánh giá mới
// @route   POST /api/v1/products/:productId/reviews
// @access  Private
exports.createReview = asyncHandler(async (req, res, next) => {
    req.body.product = req.params.productId;
    req.body.user = req.user.id;
    
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
        return next(new ErrorResponse(`Không tìm thấy sản phẩm với ID ${req.params.productId}`, 404));
    }
    
    const review = await Review.create(req.body);
    
    res.status(201).json({
        success: true,
        data: review
    });
});

// @desc    Cập nhật đánh giá
// @route   PUT /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);
    
    if (!review) {
        return next(new ErrorResponse(`Không tìm thấy đánh giá với ID ${req.params.id}`, 404));
    }
    
    // Đảm bảo người dùng là chủ sở hữu đánh giá hoặc admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Không có quyền cập nhật đánh giá này`, 401));
    }
    
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc    Xóa đánh giá
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
        return next(new ErrorResponse(`Không tìm thấy đánh giá với ID ${req.params.id}`, 404));
    }
    
    // Đảm bảo người dùng là chủ sở hữu đánh giá hoặc admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Không có quyền xóa đánh giá này`, 401));
    }
    
    await Review.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Khởi tạo dữ liệu mẫu cho đánh giá
// @route   POST /api/v1/reviews/seed
// @access  Private/Admin
exports.seedReviews = asyncHandler(async (req, res, next) => {
    // Lấy một số sản phẩm và người dùng để tạo đánh giá
    const products = await Product.find().limit(5);
    const users = await User.find().limit(5);
    
    if (products.length === 0 || users.length === 0) {
        return next(new ErrorResponse('Không đủ sản phẩm hoặc người dùng để tạo đánh giá mẫu', 400));
    }
    
    // Xóa tất cả đánh giá hiện có
    await Review.deleteMany();
    
    // Tạo 5 đánh giá mẫu
    const sampleReviews = [
        {
            user: users[0]._id,
            product: products[0]._id,
            name: users[0].name,
            rating: 5,
            comment: 'Sản phẩm rất tốt, chất lượng vượt mong đợi!'
        },
        {
            user: users[1]._id,
            product: products[1]._id,
            name: users[1].name,
            rating: 4,
            comment: 'Sản phẩm đẹp, giao hàng nhanh, nhưng giá hơi cao.'
        },
        {
            user: users[2]._id,
            product: products[2]._id,
            name: users[2].name,
            rating: 3,
            comment: 'Sản phẩm đúng như mô tả, nhưng có một số điểm cần cải thiện.'
        },
        {
            user: users[3]._id,
            product: products[3]._id,
            name: users[3].name,
            rating: 5,
            comment: 'Tuyệt vời! Sẽ mua lại sản phẩm này.'
        },
        {
            user: users[4]._id,
            product: products[4]._id,
            name: users[4].name,
            rating: 2,
            comment: 'Sản phẩm không đạt chất lượng như mong đợi, khá thất vọng.'
        }
    ];
    
    // Thêm đánh giá mẫu vào database
    const reviews = await Review.insertMany(sampleReviews);
    
    res.status(201).json({
        success: true,
        count: reviews.length,
        data: reviews
    });
}); 