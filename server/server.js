const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with debug logging
mongoose.set('debug', true);
mongoose.connect('mongodb://127.0.0.1:27017/shop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log('MongoDB Connected Successfully');
    // Create admin user on successful connection
    try {
        const User = require('./models/User');
        const existingAdmin = await User.findOne({ username: 'admin' });
        
        if (!existingAdmin) {
            console.log('Creating new admin user...');
            const admin = new User({
                username: 'admin',
                password: 'admin123',
                isAdmin: true
            });
            await admin.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error in admin user setup:', err);
    }
})
.catch(err => {
    console.log('MongoDB Connection Error:', err);
});

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));