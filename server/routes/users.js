const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Create admin if not exists
router.post('/create-admin', async (req, res) => {
    try {
        const adminExists = await User.findOne({ username: 'admin' });
        if (adminExists) {
            return res.status(400).json({ error: 'Admin already exists' });
        }

        const admin = new User({
            username: 'admin',
            password: 'admin123',
            isAdmin: true
        });
        await admin.save();
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Register
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username });
        
        const user = await User.findOne({ username });
        console.log('User found:', user ? 'yes' : 'no');
        
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch ? 'yes' : 'no');
        
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            'your_jwt_secret',
            { expiresIn: '1d' }
        );

        res.json({ token, isAdmin: user.isAdmin });
    } catch (err) {
        console.error('Login error:', err);
        res.status(400).json({ error: err.message });
    }
});

// Get cart - protected route
router.get('/cart', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.product');
        res.json(user.cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Add to cart - protected route
router.post('/cart', auth, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const user = await User.findById(req.user.id);
        
        const cartItemIndex = user.cart.findIndex(
            item => item.product.toString() === productId
        );

        if (cartItemIndex > -1) {
            user.cart[cartItemIndex].quantity += quantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();
        res.json(user.cart);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Checkout - protected route
router.post('/checkout', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('cart.product');
        
        // Create purchase history entry
        const purchase = {
            products: user.cart.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            }))
        };

        user.purchaseHistory.push(purchase);
        user.cart = [];
        await user.save();

        res.json({ message: 'Checkout successful' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;