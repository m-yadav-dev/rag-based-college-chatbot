/**
 * Centralized Error Handling Middleware
 * Must be registered AFTER all routes in server.js
 * Signature: (err, req, res, next) — Express identifies this as an error handler by the 4 params.
 */
const errorHandler = (err, req, res, next) => {
    // Log the error stack for debugging (server-side only)
    console.error(`❌ [${req.method}] ${req.originalUrl} →`, err.stack || err.message);

    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorCode = err.code || 'INTERNAL_ERROR';

    // --- Express Rate Limit ---
    if (err.code === 'RATE_LIMIT_EXCEEDED') {
        statusCode = 429;
        message = "You're asking questions a bit too fast! Please take a short breather and try again.";
        errorCode = 'RATE_LIMIT_EXCEEDED';
    } 
    // --- Gemini Quota Exceeded (429 / 503) ---
    else if (err.status === 429 || err.status === 503 || (err.message && err.message.toLowerCase().includes('quota'))) {
        statusCode = err.status || 429;
        message = "Our AI is currently handling a high volume of requests. Please try asking again in a minute.";
        errorCode = 'LLM_QUOTA_EXCEEDED';
    }
    // --- RAG Document Access Failure ---
    else if (err.code === 'RAG_ACCESS_FAILED') {
        statusCode = 503;
        message = "We are having trouble accessing the knowledge base right now. Please try again shortly.";
        errorCode = 'RAG_ACCESS_FAILED';
    }
    // --- Mongoose: Invalid ObjectId ---
    else if (err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = 400;
        message = `Invalid ID format: ${err.value}`;
        errorCode = 'BAD_REQUEST';
    }
    // --- Mongoose: Validation Error ---
    else if (err.name === 'ValidationError') {
        statusCode = 400;
        const fields = Object.values(err.errors).map(e => e.message);
        message = `Validation failed: ${fields.join(', ')}`;
        errorCode = 'BAD_REQUEST';
    }
    // --- Mongoose: Duplicate Key ---
    else if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue).join(', ');
        message = `Duplicate value for: ${field}. This already exists.`;
        errorCode = 'CONFLICT';
    }
    // --- JWT Errors ---
    else if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid authentication token.';
        errorCode = 'UNAUTHORIZED';
    } else if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Authentication token has expired. Please log in again.';
        errorCode = 'UNAUTHORIZED';
    }

    // --- Prevent leaking stack traces in production ---
    res.status(statusCode).json({
        success: false,
        message,
        code: errorCode,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = errorHandler;
