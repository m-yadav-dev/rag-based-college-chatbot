const { redis } = require('../../../config/redis');
const { generateEmbeddings } = require('../../services/embeddingService');
const VectorChunk = require('../rag/VectorChunk');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const env_vars = require('../../../config/env'); // using user's env setup
const ChatMessage = require('./ChatMessage');
const { buildRAGPrompt } = require('../../utils/promptBuilder');

let genAI = null;
const getGenAI = () => {
    if (!genAI) {
        genAI = new GoogleGenerativeAI(env_vars.GOOGLE_API_KEY);
    }
    return genAI;
};

const handleChatQuery = async (req, res, next) => {
    try {
        const { query } = req.body;

        // 1. Redis Cache Strategy
        const normalizedQuery = query.toLowerCase().trim();
        const cacheKey = `rag_cache:${Buffer.from(normalizedQuery).toString('base64')}`;

        if (redis) {    
            const cachedResponse = await redis.get(cacheKey);
            console.log("cachedResponse", cachedResponse);
            if (cachedResponse) {
                console.log('✅ Serving answer from Redis Cache');
                return res.status(200).json(JSON.parse(cachedResponse));
            }
        }

        // 2. Retrieval: Embed the user's query
        console.log('Embedding student query...');
        // generateEmbeddings expects an array and returns an array of {textChunk, embedding}
        const embeddedResult = await generateEmbeddings([normalizedQuery]);
        if (!embeddedResult || embeddedResult.length === 0) {
            return res.status(500).json({ message: "Failed to generate embedding for query" });
        }
        const queryVector = embeddedResult[0].embedding;

        let searchResults;
        try {
            console.log('Running MongoDB $vectorSearch...');
            const pipeline = [
                {
                    $vectorSearch: {
                        index: 'vector_index',
                        path: 'embedding',
                        queryVector: queryVector,
                        numCandidates: 30, // Usually 10-20x the limit
                        limit: 3 // Fetch top 3 most relevant chunks
                    }
                },
                {
                    // Join with the Document collection to get metadata (Cloudinary URL, Title)
                    $lookup: {
                        from: 'documents', // MongoDB creates collections pluralized lowercase
                        localField: 'documentId',
                        foreignField: '_id',
                        as: 'document'
                    }
                },
                {
                    $unwind: '$document'
                },
                {
                    // Format the output
                    $project: {
                        _id: 0,
                        textChunk: 1,
                        title: '$document.title',
                        cloudinaryUrl: '$document.cloudinaryUrl',
                        score: { $meta: 'vectorSearchScore' }
                    }
                }
            ];

            searchResults = await VectorChunk.aggregate(pipeline);
        } catch (ragErr) {
            console.error('Vector Search Error:', ragErr);
            const err = new Error('RAG_ACCESS_FAILED');
            err.code = 'RAG_ACCESS_FAILED';
            throw err;
        }

        // 4. LLM Generation Step
        const finalPrompt = buildRAGPrompt(query, searchResults);

        let answer;
        try {
            console.log('Generating response with Gemini 2.5 Flash...');
            const ai = getGenAI();
            const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
            
            const result = await model.generateContent({
                contents: [
                    { role: 'user', parts: [{ text: finalPrompt }] }
                ]
            });
            
            answer = result.response.text();
        } catch (llmErr) {
            console.error('Gemini API Error:', llmErr);
            throw llmErr;
        }
        
        // 5. Response & Caching Step
        // Deduplicate source citations based on Cloudinary URL
        const sourcesMap = new Map();
        searchResults.forEach(res => {
            if (!sourcesMap.has(res.cloudinaryUrl)) {
                sourcesMap.set(res.cloudinaryUrl, { title: res.title, url: res.cloudinaryUrl });
            }
        });
        const sources = Array.from(sourcesMap.values());

        const payload = {
            answer,
            sources
        };

        // Save payload to Redis with 24-hour TTL (86400 seconds)
        if (redis && redis.isOpen) {
            await redis.setEx(cacheKey, 86400, JSON.stringify(payload));
        }

        // Save to MongoDB
        if (req.user && req.user._id) {
            await ChatMessage.create({
                userId: req.user._id,
                query: query,
                answer: answer,
                sources: sources
            });
        }

        res.status(200).json(payload);

    } catch (error) {
        next(error);
    }
};

const getChatHistory = async (req, res, next) => {
    try {
        const history = await ChatMessage.find({ userId: req.user._id }).sort({ createdAt: 1 });
        res.status(200).json(history);
    } catch (error) {
        next(error);
    }
};

module.exports = { handleChatQuery, getChatHistory };
