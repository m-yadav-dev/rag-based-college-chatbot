const User = require('./User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env_vars = require("../../../config/env.js");

const JWT_SECRET = env_vars.JWT_SECRET || process.env.JWT_SECRET || 'fallback_secret_key_for_dev';

const guestLoginService = async () => {
    const timestamp = Date.now();
    const guestName = `Guest_${timestamp}`;
    const guestEmail = `guest_${timestamp}@docututor.local`;
    
    // Guests do not manually log in again, generate a robust random password
    const randomPassword = Math.random().toString(36).slice(-12);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    
    // 24 hours Time-To-Live (TTL)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    const newUser = await User.create({
        name: guestName,
        email: guestEmail,
        passwordHash: hashedPassword,
        role: 'Guest',
        expiresAt
    });

    const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    return { token, user: newUser };
};

module.exports = {
    guestLoginService
};
