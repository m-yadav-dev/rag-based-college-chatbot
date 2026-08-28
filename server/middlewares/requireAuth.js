const jwt = require('jsonwebtoken');
const env_vars = require('../config/env');
const User = require('../src/modules/auth/User');

const JWT_SECRET = env_vars.JWT_SECRET || process.env.JWT_SECRET || 'fallback_secret_key_for_dev';

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select('-passwordHash');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = requireAuth;
