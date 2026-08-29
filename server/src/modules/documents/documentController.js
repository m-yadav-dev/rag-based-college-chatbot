const Document = require('./Document');
const cloudinary = require('../../../config/cloudinary');
const mongoose = require('mongoose');
// Version 2.4.5 strictly exports a named class
const { PDFParse } = require('pdf-parse');
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

        if (!req.file.buffer) {
            console.error('❌ Fatal Error: req.file.buffer is undefined! Multer memoryStorage failed to pass the buffer.');
            return res.status(400).json({ message: 'File buffer is missing. Upload failed.' });
        }

        // 1. PDF Parsing
        console.log('[1/6] Starting PDF parsing...');
        const parser = new PDFParse({ data: req.file.buffer });
        const pdfData = await parser.getText();
        console.log("PDF Text Extracted Successfully:", pdfData.text.substring(0, 50));
        const rawText = pdfData.text;
        console.log(`[1/6] PDF parsed successfully. Extracted ${rawText.length} characters.`);

        if (!rawText || rawText.trim() === '') {
            console.warn('PDF extracted text is empty!');
            return res.status(400).json({ message: 'Could not extract text from the provided PDF.' });
        }

        // 2. Text Splitting
        console.log('[2/6] Starting text chunking...');
        const chunks = splitText(rawText);
        console.log(`[2/6] Text split successfully. Generated ${chunks.length} chunks.`);

        // 3. Generate Embeddings
        console.log('[3/6] Sending chunks to Google GenAI for embeddings...');
        const embeddedChunks = await generateEmbeddings(chunks);
        console.log(`[3/6] Embeddings generated successfully for ${embeddedChunks.length} chunks.`);

        // 4. Upload to Cloudinary using stream
        console.log('[4/6] Uploading original PDF to Cloudinary...');
        const result = await streamUpload(req.file.buffer);
        console.log(`[4/6] Cloudinary upload successful. Public ID: ${result.public_id}`);

        // 5. Save Document to MongoDB
        console.log('[5/6] Creating parent Document in MongoDB...');
        // Note: Hardcoding uploadedBy for scaffolding. Will be replaced by req.user._id in future auth phase.
        const newDocument = await Document.create({
            title,
            cloudinaryUrl: result.secure_url,
            cloudinaryId: result.public_id,
            uploadedBy: new mongoose.Types.ObjectId()
        });
        console.log(`[5/6] Document created with ID: ${newDocument._id}`);

        // 6. Save Vector Chunks to MongoDB
        console.log('[6/6] Attempting bulk DB insert for VectorChunks...');
        try {
            const vectorsToInsert = embeddedChunks.map(chunk => ({
                documentId: newDocument._id,
                textChunk: chunk.textChunk,
                embedding: chunk.embedding
            }));
            await VectorChunk.insertMany(vectorsToInsert);
            console.log(`[6/6] SUCCESS: ${vectorsToInsert.length} VectorChunks inserted into MongoDB.`);
        } catch (dbError) {
            // Rollback Document creation if chunk insertion fails to prevent orphaned records
            console.error('❌ Vector bulk insertion failed! Rolling back Document creation...');
            console.error(dbError.stack);
            await Document.findByIdAndDelete(newDocument._id);
            // Optionally delete from cloudinary here as well using result.public_id
            throw dbError;
        }

        res.status(201).json({
            message: 'Document uploaded and indexed successfully',
            document: newDocument
        });

    } catch (error) {
        console.error('❌ Fatal Upload Controller Error:');
        console.error(error.stack);
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
    getDocuments,
};
