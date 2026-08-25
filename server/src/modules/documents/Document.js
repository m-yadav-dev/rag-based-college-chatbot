const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Document title is required'],
        trim: true
    },
    cloudinaryUrl: {
        type: String,
        required: [true, 'Cloudinary URL is required']
    },
    cloudinaryId: {
        type: String,
        required: [true, 'Cloudinary ID is required']
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
