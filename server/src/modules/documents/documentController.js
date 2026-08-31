const Document = require('./Document');
const cloudinary = require('../../../config/cloudinary');
const mongoose = require('mongoose');
// Version 2.4.5 strictly exports a named class
const { PDFParse } = require('pdf-parse');
const { splitText } = require('../../utils/textSplitter');
const { generateEmbeddings } = require('../../services/embeddingService');
const VectorChunk = require('../rag/VectorChunk');
const { deleteDocumentService, renameDocumentService } = require('./document.service');

// Helper to wrap cloudinary upload stream in a promise
const streamUpload = (buffer, originalName) => {
    return new Promise((resolve, reject) => {
        // Strip the .pdf extension if it exists to prevent .pdf.pdf double extensions
        const cleanName = originalName ? originalName.replace(/\.pdf$/i, '') : "document";
        
        const stream = cloudinary.uploader.upload_stream(
            { 
                folder: 'RAG-Based College Chatbot/Documents',
                resource_type: 'image',
                format: 'pdf',
                public_id: `${cleanName}_${Date.now()}`,
                use_filename: true,
                unique_filename: true
            },
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

const uploadDocument = async (req, res, next) => {
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
        const parser = new PDFParse({ data: req.file.buffer });
        const pdfData = await parser.getText();
        const rawText = pdfData.text;

        if (!rawText || rawText.trim() === '') {
            console.warn('PDF extracted text is empty!');
            return res.status(400).json({ message: 'Could not extract text from the provided PDF.' });
        }

        // 2. Text Splitting
        const chunks = splitText(rawText);

        // 3. Generate Embeddings
        const embeddedChunks = await generateEmbeddings(chunks);

        // 4. Upload to Cloudinary using stream
        const result = await streamUpload(req.file.buffer, req.file.originalname);

        // 5. Save Document to MongoDB
        // Note: Hardcoding uploadedBy for scaffolding. Will be replaced by req.user._id in future auth phase.
        const newDocument = await Document.create({
            title,
            cloudinaryUrl: result.secure_url,
            cloudinaryId: result.public_id,
            uploadedBy: new mongoose.Types.ObjectId()
        });

        // 6. Save Vector Chunks to MongoDB
        try {
            const vectorsToInsert = embeddedChunks.map(chunk => ({
                documentId: newDocument._id,
                textChunk: chunk.textChunk,
                embedding: chunk.embedding
            }));
            await VectorChunk.insertMany(vectorsToInsert);
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
        next(error);
    }
};

const getDocuments = async (req, res, next) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });
        res.status(200).json(documents);
    } catch (error) {
        next(error);
    }
};

const deleteDocument = async (req, res, next) => {
    try {
        await deleteDocumentService(req.params.id);
        res.status(200).json({ message: 'Document and vectors deleted successfully' });
    } catch (error) {
        if (error.message === 'Document not found') error.statusCode = 404;
        next(error);
    }
};

const renameDocument = async (req, res, next) => {
    try {
        const { title: newTitle } = req.body;
        if (!newTitle || newTitle.trim() === '') {
            return res.status(400).json({ message: 'New title is required' });
        }
        const updatedDoc = await renameDocumentService(req.params.id, newTitle.trim());
        res.status(200).json(updatedDoc);
    } catch (error) {
        if (error.message === 'Document not found') error.statusCode = 404;
        next(error);
    }
};


module.exports = {
    uploadDocument,
    getDocuments,
    deleteDocument,
    renameDocument
};
