const express = require('express');
const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview,
    seedReviews
} = require('../controllers/reviews');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(getReviews);

router.route('/seed')
    .post(protect, authorize('admin'), seedReviews);

router.route('/:id')
    .get(getReview)
    .put(protect, updateReview)
    .delete(protect, deleteReview);

module.exports = router; 