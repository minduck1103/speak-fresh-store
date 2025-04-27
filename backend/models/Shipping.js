const mongoose = require('mongoose');

const ShippingSchema = new mongoose.Schema({
    districtName: {
        type: String,
        required: [true, 'Vui lòng nhập tên quận'],
        unique: true,
        trim: true
    },
    shippingFee: {
        type: Number,
        required: [true, 'Vui lòng nhập phí vận chuyển'],
        min: [0, 'Phí vận chuyển không thể âm']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Shipping', ShippingSchema); 