const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // shipper được gán
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: String,
            qty: Number,
            price: Number
        }
    ],
    shippingInfo: {
        name: String,
        phone: String,
        address: String
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'online'],
        default: 'COD'
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'picked_up', 'delivering', 'delivered', 'failed', 'rejected'],
        default: 'pending'
    },
    codConfirmed: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', OrderSchema); 