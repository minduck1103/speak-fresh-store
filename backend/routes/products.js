const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview
} = require('../controllers/products');

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(createProduct);

router.route('/:id')
    .get(getProduct)
    .put(updateProduct)
    .delete(deleteProduct);

router.route('/:id/reviews')
    .get(getProductReviews)
    .post(createProductReview)
    .delete(deleteReview);

module.exports = router; 