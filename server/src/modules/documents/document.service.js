const Document = require('./Document');
const VectorChunk = require('../rag/VectorChunk');
const cloudinary = require('../../../config/cloudinary');
const redis = require('../../../config/redis');

const clearRagCache = async () => {
    if (redis && redis.status === 'ready') {
        try {
            const keys = await redis.keys('rag_cache:*');
            if (keys.length > 0) {
                await redis.del(...keys);
                console.log(`✅ Cleared ${keys.length} RAG cache entries from Redis.`);
            }
        } catch (error) {
            console.error('⚠️ Failed to clear Redis cache:', error);
        }
    }
};

const deleteDocumentService = async (docId) => {
    const doc = await Document.findById(docId);
    if (!doc) throw new Error('Document not found');
    
    // 1. Delete from Cloudinary
    if (doc.cloudinaryId) {
        try {
            await cloudinary.uploader.destroy(doc.cloudinaryId);
            console.log(`✅ Deleted Cloudinary asset: ${doc.cloudinaryId}`);
        } catch (err) {
            console.error('⚠️ Cloudinary deletion failed (continuing DB cleanup):', err);
        }
    }
    
    // 2. Delete VectorChunks (Full Sync)
    await VectorChunk.deleteMany({ documentId: docId });
    
    // 3. Delete Document record
    await Document.findByIdAndDelete(docId);
    
    // 4. Clear Redis Cache
    await clearRagCache();
    
    return true;
};

const renameDocumentService = async (docId, newTitle) => {
    const updatedDoc = await Document.findByIdAndUpdate(
        docId,
        { title: newTitle },
        { new: true }
    );
    if (!updatedDoc) throw new Error('Document not found');
    
    // Clear Redis Cache because old cached answers might have the old title in citations
    await clearRagCache();
    
    return updatedDoc;
};

module.exports = {
    deleteDocumentService,
    renameDocumentService
};
