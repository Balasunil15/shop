const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    purchaseCount: {
        type: Number,
        default: 0
    },
    purchaseHistory: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        quantity: Number,
        purchaseDate: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);