const Order = require('../models/Order');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalAmount
    } = req.body;

    const order = await Order.create({
        items: orderItems,
        user: req.user.id,
        shippingInfo,
        paymentMethod: (paymentInfo?.method || 'COD').toUpperCase(),
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalAmount
    });

    res.status(201).json({
        success: true,
        data: order
    });
});

// @desc    Get all orders
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find().populate('items.product', 'name image price');
    console.log('[GET ORDERS] Số lượng:', orders.length);
    orders.forEach(o => console.log(`[GET ORDERS] ID: ${o._id}, status: ${o.status}`));
    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('items.product', 'name image price');

    if (!order) {
        return next(
            new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is order owner or admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to access this order`,
                401
            )
        );
    }

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id }).populate('items.product', 'name image price');

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Update order
// @route   PUT /api/v1/orders/:id
// @access  Private/Admin
exports.updateOrder = asyncHandler(async (req, res, next) => {
    let order = await Order.findById(req.params.id);

    if (!order) {
        return next(
            new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
        );
    }

    order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Delete order
// @route   DELETE /api/v1/orders/:id
// @access  Private
exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    console.log('[DELETE ORDER] Order:', order);
    console.log('[DELETE ORDER] Current user:', req.user);

    if (!order) {
        console.log('[DELETE ORDER] Order not found');
        return next(
            new ErrorResponse(`Order not found with id of ${req.params.id}`, 404)
        );
    }

    // Chỉ cho phép xóa nếu là chủ đơn hàng hoặc admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
        console.log('[DELETE ORDER] Not authorized:', req.user.id, 'order user:', order.user.toString());
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this order`,
                401
            )
        );
    }

    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        data: {}
    });
});

// Seller xác nhận đơn hàng
exports.confirmOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorResponse('Không tìm thấy đơn hàng', 404));
    if (order.status !== 'Chờ xác nhận') return next(new ErrorResponse('Chỉ xác nhận đơn hàng ở trạng thái Chờ xác nhận', 400));
    if (req.body.totalAmount) order.totalAmount = req.body.totalAmount;
    order.status = 'Chờ lấy hàng';
    await order.save();
    console.log(`[CONFIRM ORDER] ID: ${order._id}, status: ${order.status}`);
    res.json({ success: true, data: order });
});

// Seller từ chối đơn hàng
exports.rejectOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorResponse('Không tìm thấy đơn hàng', 404));
    if (order.status !== 'Chờ xác nhận') return next(new ErrorResponse('Chỉ từ chối đơn hàng ở trạng thái Chờ xác nhận', 400));
    order.status = 'Đã từ chối';
    await order.save();
    res.json({ success: true, data: order });
});

// Delivery xác nhận lấy hàng
exports.deliveryConfirmOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorResponse('Không tìm thấy đơn hàng', 404));
    if (order.status !== 'Chờ lấy hàng') return next(new ErrorResponse('Chỉ xác nhận đơn hàng ở trạng thái Chờ lấy hàng', 400));
    order.status = 'Đang giao';
    await order.save();
    res.json({ success: true, data: order });
});

// Delivery cập nhật đã giao
exports.markDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorResponse('Không tìm thấy đơn hàng', 404));
    if (order.status !== 'Đang giao') return next(new ErrorResponse('Chỉ cập nhật đơn hàng đang giao', 400));
    order.status = 'Đã giao';
    order.deliveredAt = new Date();
    await order.save();
    res.json({ success: true, data: order });
});

// Delivery cập nhật không thành công
exports.markFailed = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorResponse('Không tìm thấy đơn hàng', 404));
    if (order.status !== 'Đang giao') return next(new ErrorResponse('Chỉ cập nhật đơn hàng đang giao', 400));
    order.status = 'Không thành công';
    await order.save();
    res.json({ success: true, data: order });
});

// User hủy đơn hàng
exports.cancelOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ErrorResponse('Không tìm thấy đơn hàng', 404));
    if (order.status !== 'Chờ lấy hàng') return next(new ErrorResponse('Chỉ hủy đơn hàng ở trạng thái Chờ lấy hàng', 400));
    if (order.user.toString() !== req.user.id) return next(new ErrorResponse('Bạn không có quyền hủy đơn này', 403));
    order.status = 'Đã hủy';
    await order.save();
    res.json({ success: true, data: order });
}); 