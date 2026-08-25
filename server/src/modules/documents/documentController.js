const Document = require('./Document');
const cloudinary = require('../../../config/cloudinary');
const mongoose = require('mongoose');

// Helper to wrap cloudinary upload stream in a promise
const streamUpload = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'raw' }, // PDF is treated as raw or image depending on use case. 'raw' is safer for PDFs to retain format unless we want thumbnail generation. Let's use 'auto' or 'raw'. Wait, 'raw' means no PDF transformations. Let's use 'auto'.
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        const { Readable } = require('stream');
        const readableStream = new Readable({
            read() {
                this.push(buffer);
                this.push(null);
            }
        });
        readableStream.pipe(stream);
    });
};

const uploadDocument = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

        // Upload to Cloudinary using stream
        const result = await streamUpload(req.file.buffer);

        // Save to MongoDB
        // Note: Hardcoding uploadedBy for Day 3 scaffolding. Will be replaced by req.user._id in future auth phase.
        const newDocument = await Document.create({
            title,
            cloudinaryUrl: result.secure_url,
            cloudinaryId: result.public_id,
            uploadedBy: new mongoose.Types.ObjectId()
        });

        res.status(201).json({
            message: 'Document uploaded successfully',
            document: newDocument
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Failed to upload document', error: error.message });
    }
};

const getDocuments = async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });
        res.status(200).json(documents);
    } catch (error) {
        console.error('Fetch Error:', error);
        res.status(500).json({ message: 'Failed to fetch documents', error: error.message });
    }
};

module.exports = {
    uploadDocument,
    getDocuments
};
