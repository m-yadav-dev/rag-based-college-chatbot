const Document = require('./Document');
const cloudinary = require('../../../config/cloudinary');
const mongoose = require('mongoose');
const pdfParse = require('pdf-parse');
const { splitText } = require('../../utils/textSplitter');
const { generateEmbeddings } = require('../../services/embeddingService');
const VectorChunk = require('../rag/VectorChunk');

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

        // 1. PDF Parsing
        console.log('Parsing PDF...');
        const pdfData = await pdfParse(req.file.buffer);
        const rawText = pdfData.text;

        if (!rawText || rawText.trim() === '') {
            return res.status(400).json({ message: 'Could not extract text from the provided PDF.' });
        }

        // 2. Text Splitting
        console.log('Splitting text...');
        const chunks = splitText(rawText);
        console.log(`Created ${chunks.length} chunks.`);

        // 3. Generate Embeddings
        console.log('Fetching embeddings...');
        const embeddedChunks = await generateEmbeddings(chunks);

        // 4. Upload to Cloudinary using stream
        console.log('Uploading to Cloudinary...');
        const result = await streamUpload(req.file.buffer);

        // 5. Save Document to MongoDB
        // Note: Hardcoding uploadedBy for scaffolding. Will be replaced by req.user._id in future auth phase.
        const newDocument = await Document.create({
            title,
            cloudinaryUrl: result.secure_url,
            cloudinaryId: result.public_id,
            uploadedBy: new mongoose.Types.ObjectId()
        });

        // 6. Save Vector Chunks to MongoDB
        console.log('Saving vectors to MongoDB...');
        try {
            const vectorsToInsert = embeddedChunks.map(chunk => ({
                documentId: newDocument._id,
                textChunk: chunk.textChunk,
                embedding: chunk.embedding
            }));
            await VectorChunk.insertMany(vectorsToInsert);
        } catch (dbError) {
            // Rollback Document creation if chunk insertion fails to prevent orphaned records
            console.error('Vector insertion failed. Rolling back Document creation...', dbError);
            await Document.findByIdAndDelete(newDocument._id);
            // Optionally delete from cloudinary here as well using result.public_id
            throw dbError;
        }

        res.status(201).json({
            message: 'Document uploaded and indexed successfully',
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
