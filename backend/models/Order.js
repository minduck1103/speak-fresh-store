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
        default: null 
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
        enum: ['Chờ xác nhận', 'Chờ lấy hàng', 'Đang giao', 'Đã giao', 'Đã hủy', 'Không thành công', 'Đã từ chối'],
        default: 'Chờ xác nhận'
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