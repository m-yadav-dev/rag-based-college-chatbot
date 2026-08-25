const mongoose = require('mongoose');

const vectorChunkSchema = new mongoose.Schema({
    documentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    textChunk: {
        type: String,
        required: true
    },
    embedding: {
        type: [Number],
        required: true
    }
}, {
    timestamps: true
});

const VectorChunk = mongoose.model('VectorChunk', vectorChunkSchema);
module.exports = VectorChunk;
