const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: [true, 'Password is required']
    },
    role: {
        type: String,
        enum: ['Admin', 'Student', 'Guest'],
        default: 'Student'
    },
    expiresAt: {
        type: Date
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
module.exports = User;
