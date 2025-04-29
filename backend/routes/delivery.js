const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
    getDeliveryOrders,
    getDeliveryStats,
    updateOrderStatus,
    acceptOrder,
    rejectOrder,
    getDeliveryNotifications
} = require('../controllers/delivery');

// Protect all routes
router.use(protect);
router.use(authorize('delivery'));

router.get('/orders', getDeliveryOrders);
router.get('/stats', getDeliveryStats);
router.get('/notifications', getDeliveryNotifications);

router.put('/orders/:id/status', updateOrderStatus);
router.put('/orders/:id/accept', acceptOrder);
router.put('/orders/:id/reject', rejectOrder);

module.exports = router; 