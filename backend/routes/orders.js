const express = require('express');
const {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    getMyOrders,
    confirmOrder,
    rejectOrder,
    deliveryConfirmOrder,
    markDelivered,
    markFailed,
    cancelOrder
} = require('../controllers/orders');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder);

router.route('/myorders')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrder)
    .put(protect, authorize('admin'), updateOrder)
    .delete(protect, deleteOrder);

router.put('/:id/confirm', protect, authorize('seller'), confirmOrder);
router.put('/:id/reject', protect, authorize('seller'), rejectOrder);
router.put('/:id/delivery-confirm', protect, authorize('delivery'), deliveryConfirmOrder);
router.put('/:id/delivered', protect, authorize('delivery'), markDelivered);
router.put('/:id/failed', protect, authorize('delivery'), markFailed);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router; 