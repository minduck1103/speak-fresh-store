const Shipping = require('../models/Shipping');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Lấy danh sách tất cả phí vận chuyển
// @route   GET /api/v1/shipping
// @access  Public
exports.getShippingFees = asyncHandler(async (req, res, next) => {
    const shippingFees = await Shipping.find().sort('districtName');
    res.status(200).json({
        success: true,
        count: shippingFees.length,
        data: shippingFees
    });
});

// @desc    Lấy thông tin phí vận chuyển theo ID
// @route   GET /api/v1/shipping/:id
// @access  Public
exports.getShippingFee = asyncHandler(async (req, res, next) => {
    const shippingFee = await Shipping.findById(req.params.id);
    
    if (!shippingFee) {
        return next(new ErrorResponse(`Không tìm thấy phí vận chuyển với ID ${req.params.id}`, 404));
    }
    
    res.status(200).json({
        success: true,
        data: shippingFee
    });
});

// @desc    Tạo phí vận chuyển mới
// @route   POST /api/v1/shipping
// @access  Private/Admin
exports.createShippingFee = asyncHandler(async (req, res, next) => {
    const shippingFee = await Shipping.create(req.body);
    res.status(201).json({
        success: true,
        data: shippingFee
    });
});

// @desc    Cập nhật phí vận chuyển
// @route   PUT /api/v1/shipping/:id
// @access  Private/Admin
exports.updateShippingFee = asyncHandler(async (req, res, next) => {
    let shippingFee = await Shipping.findById(req.params.id);
    
    if (!shippingFee) {
        return next(new ErrorResponse(`Không tìm thấy phí vận chuyển với ID ${req.params.id}`, 404));
    }
    
    shippingFee = await Shipping.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    
    res.status(200).json({
        success: true,
        data: shippingFee
    });
});

// @desc    Xóa phí vận chuyển
// @route   DELETE /api/v1/shipping/:id
// @access  Private/Admin
exports.deleteShippingFee = asyncHandler(async (req, res, next) => {
    const shippingFee = await Shipping.findById(req.params.id);
    
    if (!shippingFee) {
        return next(new ErrorResponse(`Không tìm thấy phí vận chuyển với ID ${req.params.id}`, 404));
    }
    
    await shippingFee.remove();
    
    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Khởi tạo dữ liệu mẫu cho phí vận chuyển các quận TP.HCM
// @route   POST /api/v1/shipping/seed
// @access  Private/Admin
exports.seedShippingFees = asyncHandler(async (req, res, next) => {
    // Danh sách các quận của TP.HCM
    const districts = [
        { districtName: 'Quận 1', shippingFee: 30000 },
        { districtName: 'Quận 2', shippingFee: 35000 },
        { districtName: 'Quận 3', shippingFee: 30000 },
        { districtName: 'Quận 4', shippingFee: 30000 },
        { districtName: 'Quận 5', shippingFee: 30000 },
        { districtName: 'Quận 6', shippingFee: 35000 },
        { districtName: 'Quận 7', shippingFee: 40000 },
        { districtName: 'Quận 8', shippingFee: 35000 },
        { districtName: 'Quận 9', shippingFee: 40000 },
        { districtName: 'Quận 10', shippingFee: 30000 },
        { districtName: 'Quận 11', shippingFee: 30000 },
        { districtName: 'Quận 12', shippingFee: 40000 },
        { districtName: 'Quận Bình Tân', shippingFee: 45000 },
        { districtName: 'Quận Bình Thạnh', shippingFee: 35000 },
        { districtName: 'Quận Gò Vấp', shippingFee: 35000 },
        { districtName: 'Quận Phú Nhuận', shippingFee: 30000 },
        { districtName: 'Quận Tân Bình', shippingFee: 30000 },
        { districtName: 'Quận Tân Phú', shippingFee: 35000 },
        { districtName: 'Huyện Bình Chánh', shippingFee: 50000 },
        { districtName: 'Huyện Cần Giờ', shippingFee: 80000 },
        { districtName: 'Huyện Củ Chi', shippingFee: 70000 },
        { districtName: 'Huyện Hóc Môn', shippingFee: 60000 },
        { districtName: 'Huyện Nhà Bè', shippingFee: 55000 }
    ];
    
    // Xóa tất cả dữ liệu hiện có
    await Shipping.deleteMany();
    
    // Thêm dữ liệu mới
    const shippingFees = await Shipping.insertMany(districts);
    
    res.status(201).json({
        success: true,
        count: shippingFees.length,
        data: shippingFees
    });
}); 