const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    query: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    sources: [{
        title: String,
        url: String
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
