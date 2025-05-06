const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

module.exports = auth;