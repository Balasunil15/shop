const router = require('express').Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add new product (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update product (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get product purchase history (admin only)
router.get('/:id/history', auth, isAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('purchaseHistory.user', 'username');
        res.json(product.purchaseHistory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;