const express = require('express');
const {
    getShippingFees,
    getShippingFee,
    createShippingFee,
    updateShippingFee,
    deleteShippingFee,
    seedShippingFees
} = require('../controllers/shipping');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route('/')
    .get(getShippingFees)
    .post(protect, createShippingFee);

router.route('/seed')
    .post(protect, seedShippingFees);

router.route('/:id')
    .get(getShippingFee)
    .put(protect, updateShippingFee)
    .delete(protect, deleteShippingFee);

module.exports = router; 