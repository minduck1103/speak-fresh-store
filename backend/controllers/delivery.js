const Order = require('../models/Order');
const Notification = require('../models/Notification');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all orders assigned to delivery person
// @route   GET /api/v1/delivery/orders
// @access  Private/Delivery
exports.getDeliveryOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({
        $or: [
            { delivery: req.user.id },
            { status: 'pending', delivery: null }
        ]
    }).populate('user', 'name email phone')
      .populate('items.product', 'name price');

    res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
    });
});

// @desc    Get delivery statistics
// @route   GET /api/v1/delivery/stats
// @access  Private/Delivery
exports.getDeliveryStats = asyncHandler(async (req, res, next) => {
    const allDeliveries = await Order.find({ delivery: req.user.id });
    
    const totalDeliveries = allDeliveries.length;
    const successfulDeliveries = allDeliveries.filter(order => order.status === 'delivered').length;
    const onTimeDeliveries = allDeliveries.filter(order => {
        // Add your on-time delivery logic here
        return order.status === 'delivered';
    }).length;
    
    const codOrders = allDeliveries.filter(order => order.paymentMethod === 'COD' && order.status === 'delivered');
    const totalCOD = codOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    const stats = {
        totalDeliveries,
        successRate: totalDeliveries ? Math.round((successfulDeliveries / totalDeliveries) * 100) : 0,
        onTimeRate: totalDeliveries ? Math.round((onTimeDeliveries / totalDeliveries) * 100) : 0,
        totalCOD
    };

    res.status(200).json({
        success: true,
        data: stats
    });
});

// @desc    Update order status
// @route   PUT /api/v1/delivery/orders/:id/status
// @access  Private/Delivery
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body;
    
    let order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new ErrorResponse(`Không tìm thấy đơn hàng với ID ${req.params.id}`, 404));
    }
    
    if (order.delivery.toString() !== req.user.id) {
        return next(new ErrorResponse('Không có quyền cập nhật đơn hàng này', 401));
    }
    
    order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true, runValidators: true }
    );
    
    // Create notification
    await Notification.create({
        title: 'Cập nhật trạng thái đơn hàng',
        message: `Đơn hàng #${order._id} đã được cập nhật sang trạng thái: ${status}`,
        user: order.user,
        type: 'order_status'
    });

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Accept order for delivery
// @route   PUT /api/v1/delivery/orders/:id/accept
// @access  Private/Delivery
exports.acceptOrder = asyncHandler(async (req, res, next) => {
    let order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new ErrorResponse(`Không tìm thấy đơn hàng với ID ${req.params.id}`, 404));
    }
    
    if (order.delivery) {
        return next(new ErrorResponse('Đơn hàng này đã được nhận bởi người khác', 400));
    }
    
    order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            delivery: req.user.id,
            status: 'accepted'
        },
        { new: true, runValidators: true }
    );
    
    // Create notification
    await Notification.create({
        title: 'Đơn hàng được nhận',
        message: `Đơn hàng #${order._id} đã được nhận để giao`,
        user: order.user,
        type: 'order_accepted'
    });

    res.status(200).json({
        success: true,
        data: order
    });
});

// @desc    Reject order
// @route   PUT /api/v1/delivery/orders/:id/reject
// @access  Private/Delivery
exports.rejectOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
        return next(new ErrorResponse(`Không tìm thấy đơn hàng với ID ${req.params.id}`, 404));
    }
    
    if (order.status !== 'pending') {
        return next(new ErrorResponse('Chỉ có thể từ chối đơn hàng đang chờ', 400));
    }
    
    await Order.findByIdAndUpdate(
        req.params.id,
        { status: 'rejected' },
        { new: true, runValidators: true }
    );
    
    // Create notification
    await Notification.create({
        title: 'Đơn hàng bị từ chối',
        message: `Đơn hàng #${order._id} đã bị từ chối giao`,
        user: order.user,
        type: 'order_rejected'
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// @desc    Get delivery notifications
// @route   GET /api/v1/delivery/notifications
// @access  Private/Delivery
exports.getDeliveryNotifications = asyncHandler(async (req, res, next) => {
    const notifications = await Notification.find({
        $or: [
            { user: req.user.id },
            { type: 'delivery_announcement' }
        ]
    }).sort('-createdAt');

    res.status(200).json({
        success: true,
        count: notifications.length,
        data: notifications
    });
}); 