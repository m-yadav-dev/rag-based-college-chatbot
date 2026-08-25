const { GoogleGenerativeAI } = require('@google/generative-ai');
const env_vars = require("../../config/env.js")

// Initialize the SDK. We'll throw an error if the key isn't present when the service is used.
let genAI = null;

const getGenAI = () => {
    if (!genAI) {
        if (!env_vars.GOOGLE_API_KEY) {
            throw new Error('GOOGLE_API_KEY environment variable is not set.');
        }
        genAI = new GoogleGenerativeAI(env_vars.GOOGLE_API_KEY);
    }
    return genAI;
};

/**
 * Takes an array of text chunks and returns an array of objects containing the chunk and its embedding.
 * @param {string[]} chunks - Array of text strings
 * @returns {Promise<Array<{textChunk: string, embedding: number[]}>>}
 */
const generateEmbeddings = async (chunks) => {
    if (!chunks || chunks.length === 0) return [];

    const ai = getGenAI();
    // Use the recommended model for text embeddings
    const model = ai.getGenerativeModel({ model: 'text-embedding-004' });

    console.log(`Generating embeddings for ${chunks.length} chunks...`);

    // We use Promise.all to parallelize embedding requests for all chunks
    const embeddingsPromises = chunks.map(async (chunk) => {
        const result = await model.embedContent(chunk);
        return {
            textChunk: chunk,
            embedding: result.embedding.values
        };
    });

    const embeddedChunks = await Promise.all(embeddingsPromises);
    return embeddedChunks;
};

module.exports = { generateEmbeddings };
